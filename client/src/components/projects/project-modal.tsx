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
import { Input } from "../ui/input.tsx";
import useModalProject from "../../hooks/use-modal-project.ts";
import {Label} from "../ui/label.tsx";

export default function ProjectModal() {
    const { isOpen, /*user,*/ onClose } = useModalProject();

    if (!isOpen) return null;

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
                    <DialogTitle>Agregar proyecto</DialogTitle>
                    <DialogDescription>
                        Complete los campos para agregar un nuevo proyecto
                    </DialogDescription>
                </DialogHeader>
                <form autoComplete='off' className='flex flex-col gap-2'>
                    <Label className='mb-2'>
                        Nombre <span className='text-red-400'>*</span>
                        <Input className='mt-2' type="text" placeholder="Av. Palomino Grau" />
                    </Label>
                    <Label className='mb-2'>
                        Fecha de inicio <span className='text-red-400'>*</span>
                        <Input className='mt-2' type="date" placeholder="Fecha de inicio" />
                    </Label>
                    <Label className='mb-2'>
                        Fecha de cierre <span className='text-red-400'>*</span>
                        <Input className='mt-2' type="date" placeholder="Fecha de inicio" />
                    </Label>
                    <Label className='mb-2'>
                        Estado <span className='text-red-400'>*</span>
                        <Select>
                            <SelectTrigger className='mt-2'>
                                <SelectValue placeholder="Estado"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1ra Iteracion</SelectItem>
                                <SelectItem value="2">2da Iteracion</SelectItem>
                                <SelectItem value="3">3ra Iteracion</SelectItem>
                            </SelectContent>
                        </Select>
                    </Label>

                    <Label className='mb-2'>
                        Encargado <span className='text-red-400'>*</span>
                        <Input className='mt-2' type="text" placeholder="Jonny Worker" />
                    </Label>

                    <Button type="submit">Guardar</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
