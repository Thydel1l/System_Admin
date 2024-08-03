import { useEffect, useState } from "react";
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
} from "../ui/breadcrumb";

import { Button } from "../ui/button.tsx";
import { Edit2, LogOutIcon, Menu, PlusIcon, Trash } from "lucide-react";
import useModalTask from "../../hooks/use-modal-task.ts";
import useConfirmModal from "../../hooks/use-confirm-delete-modal.ts";
import { useNavigate } from 'react-router-dom';

export default function UsersList() {
    const [tasks, setTasks] = useState<any[]>([]);
    const navigate = useNavigate();
    const openModal = useModalTask((state) => state.openModal);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        if (!user.Dni) {
            navigate("/");
        } else {
            const projectIdByParams = new URLSearchParams(window.location.search).get("projectId");
            if (projectIdByParams) {
                fetch(`/api/v1/tareas/proyecto/${projectIdByParams}`).then((response) => {
                    response.json().then((data) => {
                        setTasks(data.data);
                    });
                }).catch((error) => {
                    console.error("Error fetching tasks:", error);
                });
            }
        }
    }, [navigate]);

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

    const onLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
    }

    const { openModal: openConfirmModal } = useConfirmModal();

    return (
        <>
            <div>
                <Button variant="destructive" size="sm" className="float-right"
                        onClick={onLogout}>
                    <LogOutIcon size={15} className="mr-2" />
                    Cerrar Sesión
                </Button>
            </div>
            
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" className='font-semibold'>Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>Tareas</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-start mb-2">Tareas de usuario</h1>
                <div className="flex justify-between items-center mb-4">
                    <Button size='sm' onClick={() => openModal(null)}>
                        <PlusIcon size={15} className="mr-2" /> Agregar
                    </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                    <Table>
                        <TableCaption>Lista de tareas más recientes</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] text-center">Id</TableHead>
                                <TableHead className="text-center">Titulo</TableHead>
                                <TableHead className="text-center">Descripcion</TableHead>
                                <TableHead className="text-center">Plazo</TableHead>
                                <TableHead className="text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.ID}> {/* Asegúrate de usar una clave única */}
                                    <TableCell>{task.ID}</TableCell>
                                    <TableCell>{task.Titulo}</TableCell>
                                    <TableCell>{task.Descripcion}</TableCell>
                                    <TableCell>{task.PlazoFinalizacion}</TableCell>
                                    <TableCell className="flex justify-center space-x-2">
                                        <Button variant="outline" size="icon">
                                            <Edit2 size={15} className="text-green-600"
                                            onClick={() => openModal(task)} />
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <Menu size={15} className="text-blue-600" />
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
