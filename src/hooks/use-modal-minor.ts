import {create} from 'zustand'

interface ModalState {
    isOpen: boolean;
    project: any | null;
    openModal: (user: any) => void;
    onClose: () => void;
}

const useModalMinor = create<ModalState>((set) => ({
    isOpen: false,
    project: null,
    openModal: (project) => set({isOpen: true, project}),
    onClose: () => set({isOpen: false, project: null})
}));

export default useModalMinor;
