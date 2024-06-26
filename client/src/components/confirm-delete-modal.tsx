import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import useConfirmModal from "../hooks/use-confirm-delete-modal.ts";
import { Button } from "./ui/button.tsx";

const ConfirmDeleteModal = () => {
    const { isOpen, onDelete, onClose } = useConfirmModal();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que deseas eliminar este recurso?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end">
                    <Button variant='ghost' onClick={onClose}>Cancelar</Button>
                    <Button variant='destructive' onClick={onDelete} className="btn-danger">
                        Eliminar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ConfirmDeleteModal;
