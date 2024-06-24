import {useEffect, useState} from "react";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "../ui/table";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "../ui/select"

import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator,} from "../ui/breadcrumb"

import {Input} from "../ui/input"

import {Button} from "../ui/button.tsx";
import {Edit2, LogOutIcon, Menu, PlusIcon, Search, Trash} from "lucide-react";
import useModalProject from "../../hooks/use-modal-project.ts";
import {useNavigate} from 'react-router-dom';

export default function UsersList() {
    const [projects, setProjects] = useState<any[]>([]);
    const navigate = useNavigate();
    const openModal = useModalProject((state) => state.openModal);

    const onLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    }

    useEffect(() => {

        fetch("https://jsonplaceholder.typicode.com/users").then((response) => {
            response.json().then((data) => {
                console.log(data);
            });
        })
        setProjects([
            {
                id: 1,
                project: "Americas Cup",
                startDate: "10/10/2021",
                finishDate: "-",
                state: "2da Iteracion",
                manager: "John Doe",
            },
            {
                id: 2,
                project: "Copa America",
                startDate: "03/09/2021",
                finishDate: "-",
                state: "2da Iteracion",
                manager: "John Doe",
            },
            {
                id: 3,
                project: "Copa Libertadores",
                startDate: "11/11/2020",
                finishDate: "-",
                state: "2da Iteracion",
                manager: "John Doe",
            },
            {
                id: 4,
                project: "Copa Sudamericana",
                startDate: "09/12/2020",
                finishDate: "02/02/2021",
                state: "2da Iteracion",
                manager: "John Doe",
            },
        ]);
    }, []);

    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" className='font-semibold'>Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbLink>Proyectos</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div>
                <Button variant="destructive" size="sm" className="float-right"
                        onClick={onLogout}>
                    <LogOutIcon size={15} className="mr-2"/>
                    Cerrar Sesión
                </Button></div>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-start mb-2">Proyectos</h1>
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <Input className="pr-10" placeholder="Buscar..."/>
                        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                    </div>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Estado"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1era Iteracion</SelectItem>
                            <SelectItem value="2">2da Iteracion</SelectItem>
                            <SelectItem value="3">3ra Iteracion</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size='sm' onClick={() => openModal({})}>
                        <PlusIcon size={15} className="mr-2"/> Agregar
                    </Button>

                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                    <Table>
                        <TableCaption>Lista de proyectos mas recientes</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] text-center">Item</TableHead>
                                <TableHead className="text-center">Proyecto</TableHead>
                                <TableHead className="text-center">Fecha Inicio</TableHead>
                                <TableHead className="text-center">Fecha Cierre</TableHead>
                                <TableHead className="text-center">Estado</TableHead>
                                <TableHead className="text-center">Encargado</TableHead>
                                <TableHead className="text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.map((project, index) => (
                                <TableRow key={project.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{project.project}</TableCell>
                                    <TableCell>{project.startDate}</TableCell>
                                    <TableCell>{project.finishDate}</TableCell>
                                    <TableCell>{project.state}</TableCell>
                                    <TableCell>{project.manager}</TableCell>
                                    <TableCell className="flex justify-center space-x-2">
                                        <Button variant="outline" size="icon">
                                            <Edit2 size={15} className="text-green-600"/>
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <Menu size={15} className="text-blue-600"/>
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <Trash size={15} className="text-red-600"/>
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
