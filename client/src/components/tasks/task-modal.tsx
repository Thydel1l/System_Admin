import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog.tsx";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import { Label } from "../ui/label.tsx";
import useModalTask from "../../hooks/use-modal-task.ts";

export default function ProjectModal() {
    const { isOpen, task, openModal, onClose } = useModalTask();
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTaskData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const projectId = new URLSearchParams(window.location.search).get("projectId");

            if (!projectId) {
                console.error("No se encontró el ID del proyecto.");
                return;
            }

            const plazoFinalizacion = parseInt(taskData.PlazoFinalizacion, 10);

            if (isNaN(plazoFinalizacion)) {
                console.error("PlazoFinalizacion debe ser un número entero.");
                return;
            }

            const taskPayload = {
                ...taskData,
                PlazoFinalizacion: plazoFinalizacion,
                id_proyecto: parseInt(projectId, 10)
            };

            const response = await fetch(task ? `/api/v1/tareas/${task.ID}` : `/api/v1/tareas/proyecto/${projectId}`, {
                method: task ? "PUT" : "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskPayload),
            });

            if (response.ok) {
                onClose();
            } else {
                console.error("Error:", await response.text());
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
                        Descripcion <span className='text-red-400'>*</span>
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

                    <Button type="submit" className='mt-4'>
                        {task ? "Actualizar" : "Agregar"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
