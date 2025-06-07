#!/usr/bin/env python
import os
import glob
import sys
import argparse
import subprocess
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=env_path)

DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
PA_UPLOAD_URL = 'https://chambeaya.pythonanywhere.com/api/upsql'

required = {'DB_HOST': DB_HOST, 'DB_USER': DB_USER, 'DB_PASSWORD': DB_PASSWORD, 'DB_NAME': DB_NAME}
missing = [name for name, val in required.items() if not val]
if missing:
    print(f"Error: faltan variables de entorno: {', '.join(missing)}. Revisar {env_path}.")
    sys.exit(1)

MYSQL_CMD = [
    'mysql',
    f'-h{DB_HOST}',
    f'-P{DB_PORT}',
    f'-u{DB_USER}',
    f'-p{DB_PASSWORD}',
    DB_NAME
]

FIXED_TABLES = [
    'comprobante_contrato', 'comentario', 'usuario', 'metodo_pago',
    'categoria', 'publicacion', 'contrato', 'publicacion_medio',
    'persona', 'empresa'
]

def run_sql_file(path):
    cmd = MYSQL_CMD.copy()
    with open(path, 'rb') as f:
        subprocess.run(cmd, stdin=f, check=True)

def drop_foreign_keys():
    query = (
        "SELECT TABLE_NAME, CONSTRAINT_NAME "
        "FROM information_schema.TABLE_CONSTRAINTS "
        "WHERE CONSTRAINT_TYPE='FOREIGN KEY' AND TABLE_SCHEMA=DATABASE();"
    )
    proc = subprocess.run(MYSQL_CMD + ['-N', '-e', query], capture_output=True, text=True, check=True)
    constraints = [line.split() for line in proc.stdout.strip().split('\n') if line]
    for table, constraint in constraints:
        subprocess.run(MYSQL_CMD + ['-e', f'ALTER TABLE `{table}` DROP FOREIGN KEY `{constraint}`;'], check=True)

def reset_tables():
    names = ",".join(f"'{t}'" for t in FIXED_TABLES)
    query = (
        f"SELECT table_name FROM information_schema.tables "
        f"WHERE table_schema=DATABASE() AND table_name IN ({names});"
    )
    proc = subprocess.run(
        MYSQL_CMD + ['-N', '-e', query],
        capture_output=True, text=True, check=True
    )
    existing = proc.stdout.strip().split() if proc.stdout else []
    drop_foreign_keys()
    subprocess.run(MYSQL_CMD + ['-e', 'SET FOREIGN_KEY_CHECKS=0;'], check=True)
    for tbl in existing:
        try:
            subprocess.run(MYSQL_CMD + ['-e', f'TRUNCATE TABLE `{tbl}`;'], check=True)
            print(f"Tabla {tbl} truncada.")
        except subprocess.CalledProcessError:
            print(f"Aviso: no se pudo truncar {tbl}.")
    subprocess.run(MYSQL_CMD + ['-e', 'SET FOREIGN_KEY_CHECKS=1;'], check=True)
    drop_functions()

def drop_functions():
    query = (
        "SELECT ROUTINE_NAME FROM information_schema.routines "
        "WHERE routine_schema=DATABASE() AND routine_type='FUNCTION';"
    )
    proc = subprocess.run(
        MYSQL_CMD + ['-N', '-e', query],
        capture_output=True, text=True, check=True
    )
    funcs = proc.stdout.strip().split() if proc.stdout else []
    for fn in funcs:
        subprocess.run(MYSQL_CMD + ['-e', f'DROP FUNCTION IF EXISTS `{fn}`;'], check=True)
        print(f"Función {fn} eliminada.")

def count_rows():
    query = (
        "SELECT table_name, table_rows FROM information_schema.tables "
        "WHERE table_schema=DATABASE() ORDER BY table_name;"
    )
    subprocess.run(MYSQL_CMD + ['-e', query], check=True)

def rebuild():
    reset_tables()
    base = os.path.dirname(__file__)
    for script in ['create-mysql.sql', 'functions-mysql.sql', 'inserts-mysql.sql']:
        path = os.path.join(base, script)
        print(f"Ejecutando {script}...")
        run_sql_file(path)
    print("Rebuild completo.")

def find_latest_backup():
    base = os.path.dirname(__file__)
    files = glob.glob(os.path.join(base, 'backup-*.sql'))
    return max(files, key=os.path.getmtime) if files else None

def restore_backup(file=None):
    if not file:
        file = find_latest_backup()
    if not file:
        print("No se encontraron backups.")
        return
    print(f"Restaurando desde {file}...")
    run_sql_file(file)
    print("Restauración completada.")

def upload_backup():
    path = find_latest_backup()
    if not path:
        print("No se encontraron backups para subir.")
        return
    print(f"Subiendo {path} a PythonAnywhere...")
    subprocess.run([
        'curl', '-X', 'POST', PA_UPLOAD_URL,
        '-F', f"file=@{path}"
    ], check=True)
    print("Upload completado.")

def drop_schema():
    drop_foreign_keys()
    subprocess.run(MYSQL_CMD + ['-e', 'SET FOREIGN_KEY_CHECKS=0;'], check=True)
    proc = subprocess.run(
        MYSQL_CMD + ['-N', '-e',
            "SELECT table_name FROM information_schema.tables WHERE table_schema=DATABASE();"
        ], capture_output=True, text=True, check=True
    )
    tables = proc.stdout.strip().split() if proc.stdout else []
    for tbl in tables:
        try:
            subprocess.run(MYSQL_CMD + ['-e', f'DROP TABLE IF EXISTS `{tbl}`;'], check=True)
            print(f"Tabla {tbl} eliminada.")
        except subprocess.CalledProcessError:
            print(f"No se pudo eliminar {tbl}.")
    subprocess.run(MYSQL_CMD + ['-e', 'SET FOREIGN_KEY_CHECKS=1;'], check=True)
    drop_functions()
    print("Esquema completo eliminado.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Manager DB Chambeaya')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('-r', '--reset', action='store_true', help='Truncar tablas y eliminar funciones')
    group.add_argument('-c', '--count', action='store_true', help='Contar filas por tabla')
    group.add_argument('-t', '--rebuild', action='store_true', help='Recrear esquema, funciones e inserts')
    group.add_argument('-b', '--backup', nargs='?', const='', metavar='FILE', help='Restaurar backup')
    group.add_argument('-u', '--upload', action='store_true', help='Subir backup más reciente a PythonAnywhere')
    group.add_argument('-d', '--drop', action='store_true', help='Eliminar esquema completo: tablas, claves foráneas y funciones')
    args = parser.parse_args()

    if args.reset:
        reset_tables()
    elif args.count:
        count_rows()
    elif args.rebuild:
        rebuild()
    elif args.backup is not None:
        restore_backup(args.backup)
    elif args.upload:
        upload_backup()
    elif args.drop:
        drop_schema()
