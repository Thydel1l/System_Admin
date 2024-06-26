import {create} from 'zustand'

interface ModalState {
    isOpen: boolean;
    task: any | null;
    openModal: (task: any) => void;
    onClose: () => void;
}

const useModalTask = create<ModalState>((set) => ({
    isOpen: false,
    task: null,
    openModal: (task) => set({isOpen: true, task: task}),
    onClose: () => set({isOpen: false, task: null})
}));

export default useModalTask;
