import {create} from 'zustand'

interface ModalState {
    isOpen: boolean;
    user: any | null;
    openModal: (user: any) => void;
    onClose: () => void;
}

const useModalMajor = create<ModalState>((set) => ({
    isOpen: false,
    user: null,
    openModal: (user) => set({isOpen: true, user}),
    onClose: () => set({isOpen: false, user: null})
}));

export default useModalMajor;
