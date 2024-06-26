import {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table.tsx";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "../ui/breadcrumb"

import {Input} from "../ui/input"

import {Button} from "../ui/button.tsx";
import {Edit2, Menu, PlusIcon, Search, Trash} from "lucide-react";
import useModalTask from "../../hooks/use-modal-task.ts";
import useConfirmModal from "../../hooks/use-confirm-delete-modal.ts";

export default function UsersList() {
    const [tasks, setTasks] = useState<any[]>([]);

    const openModal = useModalTask((state) => state.openModal);

    useEffect(() => {
        const projectIdByParams = new URLSearchParams(window.location.search).get("projectId");
        fetch(`/api/v1/tareas/proyecto/${projectIdByParams}`).then((response) => {
            response.json().then((data) => {
                setTasks(data.data);
            });
        })
    }, []);

    const onDeleteTask = (id: number) => () => {
        fetch(`/api/v1/tareas/${id}`, {
            method: "DELETE",
        }).then((response) => {
            if (response.ok) {
                setTasks(tasks.filter((task) => task.ID !== id));
            } else {
                console.error("Failed to delete task:", response.status);
            }
        }).catch((error) => {
            console.error("Error deleting task:", error);
        });
    }

    const {openModal: openConfirmModal} = useConfirmModal();

    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" className='font-semibold'>Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbLink>Tareas</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-start mb-2">Tareas de usuario</h1>
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <Input className="pr-10" placeholder="Buscar..."/>
                        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                    </div>
                    
                    <Button size='sm' onClick={() => openModal(null)}>
                        <PlusIcon size={15} className="mr-2"/> Agregar
                    </Button>

                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                    <Table>
                        <TableCaption>Lista de tareas    mas recientes</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] text-center">Id</TableHead>
                                <TableHead className="text-center">Titulo</TableHead>
                                <TableHead className="text-center">Descripcion</TableHead>
                                <TableHead className="text-center">Plazo</TableHead>
                                <TableHead className="text-center">Acciones </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task, index) => (
                                <TableRow key={task.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{task.Titulo}</TableCell>
                                    <TableCell>{task.Descripcion}</TableCell>
                                    <TableCell>{task.PlazoFinalizacion}</TableCell>
                                    <TableCell className="flex justify-center space-x-2">
                                        <Button variant="outline" size="icon">
                                            <Edit2 size={15} className="text-green-600"
                                            onClick={()=>openModal(task)}/>
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <Menu size={15} className="text-blue-600"/>
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <Trash size={15} className="text-red-600"
                                                   onClick={() => openConfirmModal(task.ID, onDeleteTask(task.ID))}
                                            />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>

    );
}
