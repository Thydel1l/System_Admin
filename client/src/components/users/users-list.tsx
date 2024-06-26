import {useEffect, useState} from "react";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Button} from "../ui/button.tsx";
import {Edit2, LogOutIcon, PlusIcon, Trash} from "lucide-react";
import {useNavigate} from "react-router-dom";
import userModalUser from "../../hooks/use-modal-user.ts";
import useModalUserUpdate from "../../hooks/use-modal-user-update.ts";
import UserModal from "./user-modal";
import UserModalUpdate from "./user-modal-update.tsx";
import useConfirmModal from "../../hooks/use-confirm-delete-modal.ts";

export default function UsersList() {
    const [users, setUsers] = useState<any[]>([]);
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        if (user.Rol !== 'admin') {
            navigate("/");
        }

        fetch("/api/v1/usuarios").then((response) => {
            if (response.ok) {
                response.json().then((res) => {
                    setUsers(res.data);
                });
            } else {
                console.error("Failed to fetch users:", response.status);
            }
        }).catch((error) => {
            console.error("Error fetching users:", error);
        });
    }, []);

    const addUser = (newUser: any) => {
        setUsers([...users, newUser]);
    };

    function handleOpenModalUpdateDatos(datos) {
        console.log(datos)
        const datosParaActualizar = {
            DNI: datos.Dni,
            Nombres: datos.Nombres,
            Apellido_paterno: datos.Apellido_paterno,
            Apellido_materno: datos.Apellido_materno,
            Email: datos.Email,
        }
        openModalUpdate(datosParaActualizar)
    }

    const onDeleteUser = (id: number) => () => {
        fetch(`/api/v1/usuarios/${id}`, {
            method: "DELETE",
        }).then((response) => {
            if (response.ok) {
                setUsers(users.filter((user) => user.ID !== id));
            } else {
                console.error("Failed to delete user:", response.status);
            }
        }).catch((error) => {
            console.error("Error deleting user:", error);
        });
    }

    const openModal = userModalUser((state) => state.openModal);
    const openModalUpdate = useModalUserUpdate((state) => state.openModal);
    const {openModal: openConfirmModal} = useConfirmModal();

    return (
        <>
            <div>
                <Button variant="destructive" size="sm" className="float-right" onClick={onLogout}>
                    <LogOutIcon size={15} className="mr-2"/>
                    Cerrar Sesión
                </Button>
            </div>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-start mb-2">Usuarios</h1>
                <div className="flex justify-between items-center mb-4">
                    <Button size='sm' onClick={openModal}>
                        <PlusIcon size={15} className="mr-2"/> Agregar
                    </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                    <Table>
                        <TableCaption>Lista de usuarios más recientes</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] text-center">ID</TableHead>
                                <TableHead className="text-center">Nombres</TableHead>
                                <TableHead className="text-center">Apellido Paterno</TableHead>
                                <TableHead className="text-center">Apellido Materno</TableHead>
                                <TableHead className="text-center">DNI</TableHead>
                                <TableHead className="text-center">Rol</TableHead>
                                <TableHead className="text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.ID}>
                                    <TableCell>{user.ID}</TableCell>
                                    <TableCell>{user.Nombres}</TableCell>
                                    <TableCell>{user.Apellido_paterno}</TableCell>
                                    <TableCell>{user.Apellido_materno}</TableCell>
                                    <TableCell>{user.Dni}</TableCell>
                                    <TableCell>{user.Rol}</TableCell>
                                    <TableCell className="flex justify-center space-x-2">
                                        <Button variant="outline" size="icon" onClick={() => {
                                            handleOpenModalUpdateDatos(user)
                                        }}>
                                            <Edit2 size={15} className="text-green-600"/>
                                        </Button>
                                        <Button variant="outline" size="icon"
                                                onClick={() => openConfirmModal(user.ID, onDeleteUser(user.ID))}>
                                            <Trash size={15} className="text-red-600"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <UserModal onAddUser={addUser} />
            <UserModalUpdate />
        </>
    );
}
