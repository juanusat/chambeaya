#!/usr/bin/env python
"""
Gestor de base de datos para proyecto Chambeaya.
Permite:
  -h, --help         Mostrar esta guía de uso.
  -r, --reset        Truncar tablas y eliminar funciones.
  -c, --count        Contar filas por tabla y mostrar nombres.
  -t, --rebuild      Reset completo y ejecutar scripts de esquema, funciones e inserts.
  -b, --backup [FILE] Restaurar backup; si no se indica FILE, usa el más reciente en db_setup que empiece por 'backup-'.
  -u, --upload       Subir el backup más reciente a PythonAnywhere.

Lee credenciales desde .env en el directorio raíz.
"""
import os
import glob
import argparse
import subprocess
from datetime import datetime
from dotenv import load_dotenv

# Cargar .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
PA_UPLOAD_URL = 'https://chambeaya.pythonanywhere.com/api/upsql'

MYSQL_CMD = [
    'mysql',
    f'-h{DB_HOST}',
    f'-P{DB_PORT}',
    f'-u{DB_USER}',
    f'-p{DB_PASSWORD}',
    DB_NAME
]


def run_sql_file(path):
    cmd = MYSQL_CMD.copy()
    with open(path, 'rb') as f:
        subprocess.run(cmd, stdin=f, check=True)


def reset_tables():
    sql = """
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE `comprobante_contrato`;
TRUNCATE TABLE `comentario`;
TRUNCATE TABLE `usuario`;
TRUNCATE TABLE `metodo_pago`;
TRUNCATE TABLE `categoria`;
TRUNCATE TABLE `publicacion`;
TRUNCATE TABLE `contrato`;
TRUNCATE TABLE `publicacion_medio`;
TRUNCATE TABLE `persona`;
TRUNCATE TABLE `empresa`;
SET FOREIGN_KEY_CHECKS=1;
"""
    subprocess.run(MYSQL_CMD, input=sql.encode(), check=True)
    print("Tablas truncadas.")


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
        drop = f"DROP FUNCTION IF EXISTS `{fn}`;"
        subprocess.run(MYSQL_CMD, input=drop.encode(), check=True)
        print(f"Función {fn} eliminada.")


def count_rows():
    query = (
        "SELECT table_name, table_rows FROM information_schema.tables "
        "WHERE table_schema=DATABASE() ORDER BY table_name;"
    )
    subprocess.run(MYSQL_CMD + ['-e', query], check=True)


def rebuild():
    reset_tables()
    drop_functions()
    base = os.path.dirname(__file__)
    order = ['create-mysql.sql', 'functions-mysql.sql', 'inserts-mysql.sql']
    for script in order:
        path = os.path.join(base, script)
        print(f"Ejecutando {script}...")
        run_sql_file(path)
    print("Rebuild completo.")


def find_latest_backup():
    base = os.path.dirname(__file__)
    pattern = os.path.join(base, 'backup-*.sql')
    files = glob.glob(pattern)
    if not files:
        return None
    return max(files, key=os.path.getmtime)


def restore_backup(file=None):
    if not file:
        file = find_latest_backup()
        if not file:
            print("No se encontraron backups.")
            return
    path = file
    print(f"Restaurando desde {path}...")
    run_sql_file(path)
    print("Restauración completada.")


def upload_backup():
    path = find_latest_backup()
    if not path:
        print("No se encontraron backups para subir.")
        return
    print(f"Subiendo {path} a PythonAnywhere...")
    subprocess.run([
        'curl',
        '-X', 'POST', PA_UPLOAD_URL,
        '-F', f"file=@{path}"
    ], check=True)
    print("Upload completado.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Manager DB Chambeaya')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('-r', '--reset', action='store_true', help='Truncar tablas y eliminar funciones')
    group.add_argument('-c', '--count', action='store_true', help='Contar filas por tabla')
    group.add_argument('-t', '--rebuild', action='store_true', help='Recrear esquema, funciones e inserts')
    group.add_argument('-b', '--backup', nargs='?', const='', metavar='FILE', help='Restaurar backup')
    group.add_argument('-u', '--upload', action='store_true', help='Subir backup más reciente a PythonAnywhere')
    args = parser.parse_args()

    if args.reset:
        reset_tables()
        drop_functions()
    elif args.count:
        count_rows()
    elif args.rebuild:
        rebuild()
    elif args.backup is not None:
        restore_backup(args.backup)
    elif args.upload:
        upload_backup()