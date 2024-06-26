import { create } from 'zustand';

interface ModalState {
    isOpen: boolean;
    itemId: number | null;
    onDelete: () => void;
    openModal: (id: number, onDelete: () => void) => void;
    onClose: () => void;
}

const useConfirmModal = create<ModalState>((set) => ({
    isOpen: false,
    itemId: null,
    onDelete: () => {},
    openModal: (id: number, onDelete: () => void) => set({ isOpen: true, itemId: id, onDelete }),
    onClose: () => set({ isOpen: false, itemId: null, onDelete: () => {} })
}));

export default useConfirmModal;