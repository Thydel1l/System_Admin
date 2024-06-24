import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.tsx";
import { Button } from "../ui/button.tsx";
import { PlusIcon } from "lucide-react";
import useModalUser from "../../hooks/use-modal-user.ts";
import { Input } from "../ui/input.tsx";

export default function UserModal() {
    const { isOpen, user, onClose } = useModalUser();

    if (!isOpen || !user) return null;

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
                <form autoComplete='off' className='flex flex-col gap-2'>
                    <Input type="text" placeholder="Nombre" />
                    <Input type="email" placeholder="Correo" />
                    <Input type="password" placeholder="Contrasenia"  />
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Rol"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Admin</SelectItem>
                            <SelectItem value="dark">User</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button type="submit">Guardar</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
