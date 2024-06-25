import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog.tsx";

import { Button } from "../ui/button.tsx";
import { PlusIcon } from "lucide-react";
import { Input } from "../ui/input.tsx";
import useModalTask from "../../hooks/use-modal-task.ts";
import {Label} from "../ui/label.tsx";

export default function ProjectModal() {
    const { isOpen, /*user,*/ onClose } = useModalTask();

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
                    <DialogTitle>Agregar Tarea</DialogTitle>
                    <DialogDescription>
                        Complete los campos para agregar una nueva tarea
                    </DialogDescription>
                </DialogHeader>
                <form autoComplete='off' className='flex flex-col gap-2'>

                    <Label className='mb-1'>
                        ID_TAREA <span className='text-red-400'>*</span>
                        <Input className='mt-1' type="text" placeholder="123" />
                    </Label>

                    <Label className='mb-1'>
                        Titulo <span className='text-red-400'>*</span>
                        <Input className='mt-1' type="text" placeholder="CONTROL DE LECTURA" />
                    </Label>

                    <Label className='mb-1'>
                        Descripcion  <span className='text-red-400'>*</span>
                        <Input className='mt-1' type="text" placeholder="hola mundo" />
                    </Label>
                    
                    <Label className='mb-1'>
                        Fecha de creacion <span className='text-red-400'>*</span>
                        <Input className='mt-1' type="date" placeholder="Fecha de inicio" />
                    </Label>

                    <Label className='mb-1'>
                        Duracion <span className='text-red-400'>*</span>
                        <Input className='mt-1' type="int" placeholder="4" />
                    </Label>
                    
                    <Button type="submit">Guardar Tarea</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
