import psutil
import time
import csv

def find_processes_by_name(name):
    processes = []
    for proc in psutil.process_iter(['pid', 'name']):
        if name.lower() in proc.info['name'].lower():
            processes.append(proc.info['pid'])
    return processes

def log_system_usage(interval=1, duration=60, process_names=[]):
    with open("uso_sistema.csv", "w", newline="") as csvfile:
        fieldnames = ["Marca de Tiempo", "Uso de CPU (%)", "Uso de Memoria (%)", "Uso de Disco (%)", "Red Enviada (bytes)", "Red Recibida (bytes)"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        process_ids = []
        for name in process_names:
            process_ids.extend(find_processes_by_name(name))

        end_time = time.time() + duration
        while time.time() < end_time:
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            total_cpu_usage = 0
            total_memory_usage = 0

            for pid in process_ids:
                try:
                    p = psutil.Process(pid)
                    total_cpu_usage += p.cpu_percent(interval=interval)
                    total_memory_usage += p.memory_percent()
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                    continue

            disk_usage = psutil.disk_usage('/').percent
            net_io = psutil.net_io_counters()
            total_network_sent = net_io.bytes_sent
            total_network_received = net_io.bytes_recv

            writer.writerow({
                "Marca de Tiempo": timestamp,
                "Uso de CPU (%)": total_cpu_usage,
                "Uso de Memoria (%)": total_memory_usage,
                "Uso de Disco (%)": disk_usage,
                "Red Enviada (bytes)": total_network_sent,
                "Red Recibida (bytes)": total_network_received
            })

            print(f"{timestamp} | CPU: {total_cpu_usage}% | Memoria: {total_memory_usage}% | Disco: {disk_usage}% | Enviada: {total_network_sent} bytes | Recibida: {total_network_received} bytes")

if __name__ == "__main__":
    process_names = ["Code", "brave"]  # Ajusta los nombres de los procesos según corresponda
    log_system_usage(interval=1, duration=60, process_names=process_names)
    # log_system_usage(interval=1, duration=300, process_names=process_names)

