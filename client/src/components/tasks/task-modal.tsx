import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog.tsx";
import { Button } from "../ui/button.tsx";
import { PlusIcon } from "lucide-react";
import { Input } from "../ui/input.tsx";
import { Label } from "../ui/label.tsx";
import useModalTask from "../../hooks/use-modal-task.ts";
import { useState, useEffect } from "react";

export default function ProjectModal() {
    const { isOpen, task, openModal, onClose } = useModalTask(); // Hook para manejar el estado del modal y la tarea
    const [taskData, setTaskData] = useState({
        Titulo: "",
        Descripcion: "",
        PlazoFinalizacion: "",
    });

    useEffect(() => {
        if (task) {
            setTaskData({
                Titulo: task.Titulo ?? '',
                Descripcion: task.Descripcion ?? '',
                PlazoFinalizacion: task.PlazoFinalizacion ?? '',
            });
        } else {
            setTaskData({
                Titulo: "",
                Descripcion: "",
                PlazoFinalizacion: "",
            });
        }
    }, [task]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!task) {
                // Agregar nueva tarea
                const projectId = new URLSearchParams(window.location.search).get("projectId");
                if (!projectId) {
                    console.error("Project ID no encontrado en la URL");
                    return;
                }

                const response = await fetch(`/api/v1/tareas/proyecto/${projectId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Titulo: taskData.Titulo,
                        Descripcion: taskData.Descripcion,
                        PlazoFinalizacion: Number(taskData.PlazoFinalizacion),
                    }),
                });

                if (response.ok) {
                    onClose(); // Cierra el modal después de guardar
                    window.location.reload();
                    // Puedes realizar alguna acción adicional después de guardar, como actualizar la lista de tareas
                } else {
                    console.error("Error al agregar tarea:", response.status);
                }
            } else {
                // Actualizar tarea existente
                const response = await fetch(`/api/v1/tareas/${task.ID}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(taskData),
                });

                if (response.ok) {
                    onClose(); // Cierra el modal después de guardar
                    window.location.reload();
                    // Puedes realizar alguna acción adicional después de guardar, como actualizar la lista de tareas
                } else {
                    console.error("Error al editar tarea:", response.status);
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{task ? "Editar Tarea" : "Agregar Tarea"}</DialogTitle>
                    <DialogDescription>
                        Complete los campos para {task ? "editar" : "agregar"} una tarea
                    </DialogDescription>
                </DialogHeader>
                <form autoComplete='off' className='flex flex-col gap-2' onSubmit={handleSubmit}>
                    <Label className='mb-1'>
                        Titulo <span className='text-red-400'>*</span>
                        <Input
                            className='mt-1'
                            type="text"
                            name="Titulo"
                            value={taskData.Titulo}
                            onChange={handleInputChange}
                            placeholder="CONTROL DE LECTURA"
                        />
                    </Label>

                    <Label className='mb-1'>
                        Descripcion  <span className='text-red-400'>*</span>
                        <Input
                            className='mt-1'
                            type="text"
                            name="Descripcion"
                            value={taskData.Descripcion}
                            onChange={handleInputChange}
                            placeholder="hola mundo"
                        />
                    </Label>

                    <Label className='mb-1'>
                        Plazo <span className='text-red-400'>*</span>
                        <Input
                            className='mt-1'
                            type="number"
                            name="PlazoFinalizacion"
                            value={taskData.PlazoFinalizacion}
                            onChange={handleInputChange}
                            placeholder="Fecha de finalización"
                        />
                    </Label>

                    <Button type="submit">{task ? "Guardar Cambios" : "Guardar Tarea"}</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
