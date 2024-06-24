import { useEffect, useState } from "react";
import UserModal from "../components/users/user-modal.tsx";
import ProjectModal from "../components/projects/project-modal.tsx";
import MinorModal from "../components/minors/minor-modal";

export function ModalProvider() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <UserModal/>
            <ProjectModal/>
            <MinorModal/> 
        </>
    );
}
