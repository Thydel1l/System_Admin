import React, { useEffect, useState } from "react";
import UserModal from "@/components/users/user-modal.tsx";
import ProjectModal from "@/components/projects/project-modal.tsx";

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
        </>
    );
}
