import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import useModalMinor from "@/hooks/use-modal-minor.ts";
import {Label} from "@/components/ui/label.tsx";

export default function ProjectModal() {
    const { isOpen, /*user,*/ onClose } = useModalMinor();

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger>
                <Button>
                    <PlusIcon size={24} />
                    Login
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Login</DialogTitle>
                    <DialogDescription>
                        Complete los campos para iniciar sesión
                    </DialogDescription>
                </DialogHeader>
                <form autoComplete='off' className='flex flex-col gap-2'>
                    <Label className='mb-2'>
                        Correo <span className='text-red-400'>*</span>
                        <Input className='mt-2' type="text" placeholder="abc@123.com.pe" />
                    </Label>
                                    
                    <Label className='mb-2'>
                        Contraseña <span className='text-red-400'>*</span>
                        <Input className='mt-2' type="text" placeholder="JonnyWorker123" />
                    </Label>

                    <Button type="submit">Iniciar Sesión</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
