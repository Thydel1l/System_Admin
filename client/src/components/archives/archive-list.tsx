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
} from "../ui/breadcrumb.tsx"



import {Button} from "../ui/button.tsx";
import {Edit2, Menu, PlusIcon,  Trash} from "lucide-react";
import useModalArchive from "../../hooks/use-modal-archive.ts";

export default function UsersList() {
    const [archives, setArchives] = useState<any[]>([]);

    const openModal = useModalArchive((state) => state.openModal);

    useEffect(() => {
        //fetch users
        fetch("https://jsonplaceholder.typicode.com/users").then((response) => {
            response.json().then((data) => {
                console.log(data);
            });
        })
        setArchives([
            {
                id_usuario: "1",
                Nombre: "Americas",
                Tipo: ".jpg",
                Ruta: "c:/desktop/images/americas.jpg",
                id_tarea: "1",
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
                        <BreadcrumbLink>Archivos</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-start mb-2">Archivos de usuario</h1>
                <div className="flex justify-between items-center mb-4">
                    
                    
                    <Button size='sm' onClick={() => openModal({})}>
                        <PlusIcon size={15} className="mr-2"/> Agregar Archivo
                    </Button>

                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                    <Table>
                        <TableCaption>Lista de archivos recientes</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] text-center">Id</TableHead>
                                <TableHead className="text-center">Nombre</TableHead>
                                <TableHead className="text-center">Tipo</TableHead>
                                <TableHead className="text-center">Ruta</TableHead>
                                <TableHead className="text-center">id_tarea</TableHead>
                                                                
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {archives.map((archive, index) => (
                                <TableRow key={archive.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{archive.Nombre}</TableCell>
                                    <TableCell>{archive.Tipo}</TableCell>
                                    <TableCell>{archive.Ruta}</TableCell>
                                    <TableCell>{archive.id_tarea}</TableCell>
                                    
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
