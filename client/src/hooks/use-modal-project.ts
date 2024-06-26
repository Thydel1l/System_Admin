import {create} from 'zustand'

interface ModalState {
    isOpen: boolean;
    project: any | null;
    openModal: (project: any) => void;
    onClose: () => void;
}

const useModalProject = create<ModalState>((set) => ({
    isOpen: false,
    project: null,
    openModal: (project) => set({isOpen: true, project: project}),
    onClose: () => set({isOpen: false, project: null})
}));

export default useModalProject;
