import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button.tsx";
import { Edit2, LogOutIcon, PlusIcon, Trash } from "lucide-react";
import useModalProject from "../../hooks/use-modal-project.ts";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import useConfirmModal from "../../hooks/use-confirm-delete-modal.ts";


export default function UsersList() {
    const [projects, setProjects] = useState<any[]>([]);
    const navigate = useNavigate();
    const openModal = useModalProject((state) => state.openModal);

    const onLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        const userId = user.Dni;
        if (!userId) {
            navigate("/");
        }
        fetch(`/api/v1/proyectos/usuario/${userId}`).then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    setProjects([
                        ...data.data.map((project) => ({
                            ...project,
                            FechaInicio: format(new Date(project.FechaInicio), 'yyyy-MM-dd'),
                            FechaFin: format(new Date(project.FechaFin), 'yyyy-MM-dd'),
                        }))
                    ]);
                });
            } else {
                console.error("Failed to fetch projects:", response.status);
            }
        }).catch((error) => {
            console.error("Error fetching projects:", error);
        });
    }, []);

    const onDeleteProject = (id: number) => () => {
        fetch(`/api/v1/proyectos/${id}`, {
            method: "DELETE",
        }).then((response) => {
            if (response.ok) {
                setProjects(projects.filter((project) => project.ID !== id));
            } else {
                console.error("Failed to delete project:", response.status);
            }
        }).catch((error) => {
            console.error("Error deleting project:", error);
        });
    }

    const {openModal: openConfirmModal} = useConfirmModal();

    return (
        <>
            <div>
                <Button variant="destructive" size="sm" className="float-right"
                        onClick={onLogout}>
                    <LogOutIcon size={15} className="mr-2" />
                    Cerrar Sesión
                </Button>
            </div>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-start mb-2">Proyectos</h1>
                <div className="flex justify-between items-center mb-4">
                    <Button size='sm' onClick={() => openModal(null)}>
                        <PlusIcon size={15} className="mr-2" /> Agregar
                    </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                    <Table>
                        <TableCaption>Lista de Proyectos</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] text-center">ID</TableHead>
                                <TableHead className="text-center">Nombre</TableHead>
                                <TableHead className="text-center">Descripción</TableHead>
                                <TableHead className="text-center">Fecha de Inicio</TableHead>
                                <TableHead className="text-center">Fecha de Fin</TableHead>
                                <TableHead className="text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.map((project) => (
                                <TableRow key={project.ID}>
                                    <TableCell className="text-center">{project.ID}</TableCell>
                                    <TableCell className="text-center">{project.Nombre}</TableCell>
                                    <TableCell className="text-center">{project.Descripcion}</TableCell>
                                    <TableCell className="text-center">{project.FechaInicio}</TableCell>
                                    <TableCell className="text-center">{project.FechaFin}</TableCell>
                                    <TableCell className="flex justify-center space-x-2">
                                        <Button variant="outline" size="icon"
                                                onClick={() => openModal(project)}>
                                            <Edit2 size={15} className="text-green-600" />
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <Trash size={15} className="text-red-600"
                                                   onClick={() => openConfirmModal(project.ID, onDeleteProject(project.ID))}
                                            />
                                        </Button>
                                        <Button variant="outline" size="icon" disabled>
                                            <span className="text-xl text-blue-600 font-bold">T</span>
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
