import {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {Input} from "@/components/ui/input"

import {Button} from "@/components/ui/button.tsx";
import {Edit2, Menu, PlusIcon, Search, Trash} from "lucide-react";
import userModalUser from "@/hooks/use-modal-user.ts";

export default function UsersList() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        //fetch users
        fetch("/api/v1/usuarios").then((response) => {
            response.json().then((res) => {
                setUsers(res.data);
            });
        })

    }, []);

    const openModal = userModalUser((state) => state.openModal);

    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" className='font-semibold'>Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbLink>Usuarios</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-start mb-2">Usuarios</h1>
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <Input className="pr-10" placeholder="Buscar..."/>
                        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                    </div>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Rol"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Admin</SelectItem>
                            <SelectItem value="dark">User</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size='sm' onClick={() => openModal({})}>
                        <PlusIcon size={15} className="mr-2"/> Agregar
                    </Button>

                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                    <Table>
                        <TableCaption>Lista de usuarios mas recientes</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] text-center">Item</TableHead>
                                <TableHead className="text-center">Usuario</TableHead>
                                <TableHead className="text-center">Email</TableHead>
                                <TableHead className="text-center">Contraseña</TableHead>
                                <TableHead className="text-center">Rol</TableHead>
                                <TableHead className="text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.Nombres}</TableCell>
                                    <TableCell>{user.Email}</TableCell>
                                    <TableCell>{user.Password}</TableCell>
                                    <TableCell>{user.Rol}</TableCell>
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
