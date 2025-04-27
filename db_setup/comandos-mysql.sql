-- Ver tablas y cantidad de columnas

SELECT table_name, table_rows
FROM information_schema.tables
WHERE table_schema = DATABASE();


-- Ver funciones y procedimientos
SELECT 
    ROUTINE_NAME, 
    ROUTINE_TYPE 
FROM 
    information_schema.ROUTINES 
WHERE 
    ROUTINE_SCHEMA = DATABASE();
