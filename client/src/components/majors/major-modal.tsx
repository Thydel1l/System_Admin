import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import useModalMajor from "@/hooks/use-modal-major.ts";
import { Input } from "@/components/ui/input.tsx";

export default function UserModal() {
    const { isOpen, user, onClose } = useModalMajor();

    if (!isOpen || !user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger>
                <Button>
                    <PlusIcon size={24} />
                        login
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
