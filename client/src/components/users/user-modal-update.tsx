import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import {Label} from "../ui/label.tsx";
import { PlusIcon } from "lucide-react";
import useModalUserUpdate from "../../hooks/use-modal-user-update";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";

export default function UserModalUpdate() {
    const { isOpen, onClose, user } = useModalUserUpdate();
    console.log(user)
    const [newUser, setNewUser] = useState({
        Dni: "",
        Nombres: "",
        Apellido_paterno: "",
        Apellido_materno: "",
        Email: "",
        Password: "",
        Rol: "normal",
        FechaNacimiento: "",
        Habilitado: true,
    });

    useEffect(() => {
        const nuevosDatos = {
            Nombres: user?.Nombres || "",
            Apellido_paterno: user?.Apellido_paterno || "",
            Apellido_materno: user?.Apellido_materno || "",
            Email: user?.Email || "",
            Password: "",
        }
        setNewUser(nuevosDatos)
    }, [user])

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('nuevo usuario',newUser)
        try {
            const response = await fetch(`http://localhost:8080/api/v1/usuarios/dni/${user?.DNI}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            });
            console.log(response);
            if (response.ok) {
                console.log('llego a actualizar el user');

                onClose();
                window.location.reload();
            } else {
                console.error("Failed to update user");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger>
                <Button>
                    <PlusIcon size={24} />
                    Agregar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar usuario</DialogTitle>
                    <DialogDescription>
                        Complete los campos para agregar un nuevo usuario
                    </DialogDescription>
                </DialogHeader>
                <form autoComplete='off' className='flex flex-col gap-1' onSubmit={handleSubmit}>

                    <Label className="mt-2">
                        Nombres:
                    </Label>
                    <Input type="text" name="Nombres" placeholder="Ingrese nombres" value={newUser.Nombres} onChange={handleInputChange} required />
                    
                    <Label className="mt-2">
                        Apellido Paterno:
                    </Label>
                    <Input type="text" name="Apellido_paterno" placeholder="Ingrese apellido paterno" value={newUser.Apellido_paterno} onChange={handleInputChange} required />
                    
                    <Label className="mt-2">
                        Apellido Materno:
                    </Label>
                    <Input type="text" name="Apellido_materno" placeholder="Ingrese apellido materno" value={newUser.Apellido_materno} onChange={handleInputChange} required />
                    
                    <Label className="mt-2">
                        Correo:
                    </Label>
                    <Input type="email" name="Email" placeholder="Ingrese correo electrónico" value={newUser.Email} onChange={handleInputChange} required />
                    
                    <Label className="mt-2">
                        Contraseña:
                    </Label>
                    <Input type="password" name="Password" placeholder="Ingrese contraseña" value={newUser.Password} onChange={handleInputChange} required />
                    
                    
                    <Button type="submit">Editar</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
