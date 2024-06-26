import React, { useState, useEffect, useRef } from "react";
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
import {Camera, DeleteIcon} from "lucide-react";

export default function ProjectModal() {
    const { isOpen, task, openModal, onClose } = useModalTask();
    const [taskData, setTaskData] = useState({
        Titulo: "",
        Descripcion: "",
        PlazoFinalizacion: "",
    });
    const [selectedImage, setSelectedImage] = useState(null); // Estado para almacenar la imagen seleccionada

    const fileInputRef = useRef(null); // Referencia al input de archivo

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

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleCameraClick = () => {
        // Simular clic en el input de archivo
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null); // Limpiar la imagen seleccionada
        // También podrías querer limpiar el input de archivo
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Tu lógica de guardar o editar tarea aquí...
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

                    <Label className='mb-1'>
                        Subir Archivo <span className='text-red-400'>*</span>
                    </Label>
                    <div className='w-full border border-gray-200 flex justify-center align-center py-3'>
                        <Camera size={24} onClick={handleCameraClick} style={{ cursor: 'pointer' }} />
                    </div>
                    <Input
                        className='mt-1'
                        type="file"
                        name="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }} // Ocultar el input de archivo
                        onChange={handleFileInputChange}
                    />

                    {/* Mostrar la imagen seleccionada y botón para eliminar */}
                    {selectedImage && (
                        <div className="mt-2 flex items-center relative">
                            <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="max-w-full h-auto" />
                            <Button className="ml-2 absolute b-0 r-0" variant='destructive' onClick={handleRemoveImage}>
                                X
                            </Button>
                        </div>
                    )}

                    <Button type="submit">{task ? "Guardar Cambios" : "Guardar Tarea"}</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
