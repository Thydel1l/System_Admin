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
import useModalUser from "../../hooks/use-modal-user";
import { Input } from "../ui/input";
import { useState } from "react";

export default function UserModal({ onAddUser }: { onAddUser: (user: any) => void }) {
    const { isOpen, onClose } = useModalUser();
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

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/v1/usuarios/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            });
            console.log(response);
            if (response.ok) {
                console.log('llego a enviar el user');
                // const res = await response.json();
                //console.log('res en json', res);
                //onAddUser(res.data);
                onClose();
                window.location.reload();
            } else {
                console.error("Failed to add user");
            }
        } catch (error) {
            console.error("Error adding user:", error);
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
                        DNI:
                    </Label>
                    <Input type="text" name="Dni" placeholder="Ingrese DNI" value={newUser.Dni} onChange={handleInputChange} required />
                    
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
                    
                    <Label className="mt-2">
                        Fecha de Nacimiento:
                    </Label>
                    <Input type="date" name="FechaNacimiento" placeholder="Ingrese fecha de nacimiento" value={newUser.FechaNacimiento} onChange={handleInputChange} required />
                    
                    <Label className="mt-2">
                        Rol:
                    </Label>
                    <Select name="Rol" onValueChange={(value) => setNewUser({ ...newUser, Rol: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="normal">Usuario</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Button type="submit">Guardar</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
