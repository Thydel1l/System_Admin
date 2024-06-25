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
import useModalArchive from "../../hooks/use-modal-archive.ts";
import {Label} from "../ui/label.tsx";

export default function ProjectModal() {
    const { isOpen, /*user,*/ onClose } = useModalArchive();

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
                    <DialogTitle>Agregar Archivo</DialogTitle>
                    <DialogDescription>
                        Complete los campos para agregar un nuevo archivo
                    </DialogDescription>
                </DialogHeader>
                <form autoComplete='off' className='flex flex-col gap-2'>

                    <Label className='mb-1'>
                        Id_archivo <span className='text-red-400'>*</span>
                        <Input className='mt-1' type="text" placeholder="123" />
                    </Label>

                    <Label className='mb-1'>
                        Nombre <span className='text-red-400'>*</span>
                        <Input className='mt-1' type="text" placeholder="LECTURA" />
                    </Label>

                    <Label className='mb-1'>
                        Tipo  <span className='text-red-400'>*</span>
                        <Input className='mt-1' type="text" placeholder="documento" />
                    </Label>
                    
                    
                    <Label className='mb-1'>
                        Ruta <span className='text-red-400'>*</span>
                        <Input className='mt-1' type="text" placeholder="c:/desktop/documents"/>
                    </Label>
                    
                    <Button type="submit">Guardar Archivo</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
