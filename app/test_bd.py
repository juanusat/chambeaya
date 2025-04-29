import json
from tabulate import tabulate
from bd_conn import obtener_conexion
import datetime

def obtener_datos():
    conexion = obtener_conexion()
    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT * FROM usuario;")
            columnas = [desc[0] for desc in cursor.description]
            resultados = cursor.fetchall()

            print("\nDatos en formato TABLA:\n")
            print(tabulate(resultados, headers=columnas, tablefmt="pretty"))

            lista_dict = []
            for fila in resultados:
                fila_dict = {}
                for col, val in zip(columnas, fila):
                    if isinstance(val, (datetime.date, datetime.datetime)):
                        fila_dict[col] = val.isoformat()
                    else:
                        fila_dict[col] = val
                lista_dict.append(fila_dict)

            print("\nDatos en formato JSON:\n")
            print(json.dumps(lista_dict, indent=4, ensure_ascii=False))

    finally:
        conexion.close()

if __name__ == "__main__":
    obtener_datos()