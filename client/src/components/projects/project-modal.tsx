import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,} from "../ui/dialog";
import {Button} from "../ui/button.tsx";
import {Input} from "../ui/input.tsx";
import {Label} from "../ui/label.tsx";
import {useEffect, useState} from "react";
import useModalProject from "../../hooks/use-modal-project.ts";

export default function ProjectModal() {
    const {isOpen, project, onClose} = useModalProject();
    const [projectData, setProjectData] = useState({
        Nombre: "",
        Descripcion: "",
        FechaInicio: "",
        FechaFin: "",
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setProjectData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!project){
            const user = JSON.parse(localStorage.getItem("user"));
            const response = await fetch(`/api/v1/proyectos/usuario/${user.Dni}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(projectData),
            });

            if (response.ok) {
                window.location.reload()
            } else {
                console.error("Error al agregar proyecto");
            }
        }
        else{
            const response = await fetch(`/api/v1/proyectos/${project.ID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(projectData),
            });

            if (response.ok) {
                window.location.reload()
            } else {
                console.error("Error al editar proyecto");
            }
        }
    };

    useEffect(() => {
        console.log(project)
        if (project) {
            setProjectData({
                Nombre: project.Nombre ?? '',
                Descripcion: project.Descripcion ?? '',
                FechaInicio: project.FechaInicio ?? '',
                FechaFin: project.FechaFin ?? '',
            });
        }
    }, [isOpen, project]);

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {project ? "Editar proyecto" : "Agregar proyecto"}
                    </DialogTitle>
                    <DialogDescription>
                        Complete los campos para
                        {project ? " editar" : " agregar"}
                        un nuevo proyecto
                    </DialogDescription>
                </DialogHeader>
                <form autoComplete='off' className='flex flex-col gap-2' onSubmit={handleSubmit}>
                    <Label className='mb-2'>
                        Nombre <span className='text-red-400'>*</span>
                        <Input
                            className='mt-2'
                            type="text"
                            name="Nombre"
                            value={projectData.Nombre}
                            onChange={handleInputChange}
                            placeholder="Nombre del proyecto"
                        />
                    </Label>
                    <Label className='mb-2'>
                        Descripción
                        <Input
                            className='mt-2'
                            type="text"
                            name="Descripcion"
                            value={projectData.Descripcion}
                            onChange={handleInputChange}
                            placeholder="Descripción del proyecto"
                        />
                    </Label>
                    <Label className='mb-2'>
                        Fecha de inicio <span className='text-red-400'>*</span>
                        <Input
                            className='mt-2'
                            type="date"
                            name="FechaInicio"
                            value={projectData.FechaInicio}
                            onChange={handleInputChange}
                            placeholder="Fecha de inicio"
                        />
                    </Label>
                    <Label className='mb-2'>
                        Fecha de cierre <span className='text-red-400'>*</span>
                        <Input
                            className='mt-2'
                            type="date"
                            name="FechaFin"
                            value={projectData.FechaFin}
                            onChange={handleInputChange}
                            placeholder="Fecha de cierre"
                        />
                    </Label>

                    <Button type="submit">Guardar</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
