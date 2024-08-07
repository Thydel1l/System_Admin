import mysql.connector
import time
import threading
import psutil
import matplotlib.pyplot as plt
import csv
import os

# Configura la conexión a tu base de datos
db_config = {
    'host': '127.0.0.1',
    'port': 3307,
    'user': 'root',
    'password': '48770660',
    'database': 'system_proyectos'
}

# Listas para almacenar los datos de rendimiento
response_times_query1 = []
response_times_query2 = []
cpu_usages = []
memory_usages = []

# Variables para métricas adicionales
successful_queries = 0
failed_queries = 0

# Carpeta para guardar los resultados
output_folder = 'Stress'
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Función para realizar pruebas de estrés y recolectar datos
def stress_test():
    global response_times_query1, response_times_query2, cpu_usages, memory_usages
    global successful_queries, failed_queries

    try:
        # Conecta a la base de datos
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Marcar el tiempo de inicio de la prueba
        start_time = time.time()

        while time.time() - start_time < 60:  # Ejecutar pruebas durante 60 segundos
            try:
                # Consulta 1
                query_start_time = time.time()
                cursor.execute("SELECT * FROM usuarios")  # Reemplaza 'usuarios' con el nombre de tu tabla
                cursor.fetchall()
                query_time = time.time() - query_start_time
                response_times_query1.append(query_time)
                successful_queries += 1
                
                # Consulta 2
                query_start_time = time.time()
                cursor.execute("SELECT * FROM proyectos WHERE id_usuario IN (SELECT id FROM usuarios WHERE dni = '11112222')")  # Reemplaza con la lógica adecuada
                cursor.fetchall()
                query_time = time.time() - query_start_time
                response_times_query2.append(query_time)
                successful_queries += 1
                
                # Recolecta datos de rendimiento
                cpu_usages.append(psutil.cpu_percent(interval=1))
                memory_usages.append(psutil.virtual_memory().percent)
                
            except mysql.connector.Error as e:
                print(f"Error durante la consulta: {e}")
                failed_queries += 1
            
            time.sleep(1)  # Espera antes de la siguiente consulta

    except mysql.connector.Error as err:
        print(f"Error de conexión: {err}")

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# Marcar el tiempo de inicio del script
script_start_time = time.time()

# Número de hilos para realizar pruebas de estrés
num_threads = 5
threads = []

for i in range(num_threads):
    thread = threading.Thread(target=stress_test)
    thread.start()
    threads.append(thread)

# Espera a que todos los hilos terminen
for thread in threads:
    thread.join()

# Guardar los resultados en archivos CSV con nombres intuitivos
with open(os.path.join(output_folder, 'response_times_query1.csv'), 'w', newline='') as file1:
    writer = csv.writer(file1)
    writer.writerow(['Número de Consulta', 'Tiempo de Respuesta (s)', 'Uso de CPU (%)', 'Uso de Memoria (%)'])
    for i in range(len(response_times_query1)):
        writer.writerow([i+1, response_times_query1[i], cpu_usages[i] if i < len(cpu_usages) else '', memory_usages[i] if i < len(memory_usages) else ''])

with open(os.path.join(output_folder, 'response_times_query2.csv'), 'w', newline='') as file2:
    writer = csv.writer(file2)
    writer.writerow(['Número de Consulta', 'Tiempo de Respuesta (s)', 'Uso de CPU (%)', 'Uso de Memoria (%)'])
    for i in range(len(response_times_query2)):
        writer.writerow([i+1, response_times_query2[i], cpu_usages[i] if i < len(cpu_usages) else '', memory_usages[i] if i < len(memory_usages) else ''])

# Generar gráficos para visualizar los datos
plt.figure(figsize=(14, 12))

# Gráfico del tiempo de respuesta para Consulta 1
plt.subplot(4, 1, 1)
plt.plot(response_times_query1, label='Tiempo de Respuesta Consulta 1 (segundos)', color='blue')
plt.xlabel('Número de Consulta')
plt.ylabel('Tiempo (s)')
plt.legend()
plt.grid(True)
plt.savefig(os.path.join(output_folder, 'response_times_query1_plot.png'))

# Gráfico del tiempo de respuesta para Consulta 2
plt.subplot(4, 1, 2)
plt.plot(response_times_query2, label='Tiempo de Respuesta Consulta 2 (segundos)', color='orange')
plt.xlabel('Número de Consulta')
plt.ylabel('Tiempo (s)')
plt.legend()
plt.grid(True)
plt.savefig(os.path.join(output_folder, 'response_times_query2_plot.png'))

# Gráfico del uso de CPU
plt.subplot(4, 1, 3)
plt.plot(cpu_usages, label='Uso de CPU (%)', color='red')
plt.xlabel('Número de Consulta')
plt.ylabel('Uso de CPU (%)')
plt.legend()
plt.grid(True)

# Gráfico del uso de memoria
plt.subplot(4, 1, 4)
plt.plot(memory_usages, label='Uso de Memoria (%)', color='green')
plt.xlabel('Número de Consulta')
plt.ylabel('Uso de Memoria (%)')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig(os.path.join(output_folder, 'cpu_memory_usage_plot.png'))

# Crear gráficos de tipo pie para el análisis de uso de CPU y memoria
cpu_usage_pie = plt.figure(figsize=(8, 8))
plt.pie([sum(cpu_usages), sum(memory_usages)], labels=['CPU', 'Memoria'], autopct='%1.1f%%', colors=['red', 'green'])
plt.title('Distribución del Uso de CPU y Memoria')
plt.savefig(os.path.join(output_folder, 'cpu_memory_pie_chart.png'))
plt.close()

# Imprimir métricas adicionales
total_queries = successful_queries + failed_queries
latency_mean_query1 = sum(response_times_query1) / len(response_times_query1) if response_times_query1 else 0
latency_mean_query2 = sum(response_times_query2) / len(response_times_query2) if response_times_query2 else 0
print(f"Métricas Adicionales:")
print(f"Total de Consultas: {total_queries}")
print(f"Consultas Exitosas: {successful_queries}")
print(f"Consultas Fallidas: {failed_queries}")
print(f"Latencia Media Consulta 1: {latency_mean_query1:.4f} segundos")
print(f"Latencia Media Consulta 2: {latency_mean_query2:.4f} segundos")
print(f"Tiempo Total de Ejecución: {time.time() - script_start_time:.2f} segundos")

# Finalizar el script
print("Proceso completado. Los resultados se han guardado en la carpeta 'Stress'.")
