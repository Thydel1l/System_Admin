import React from "react";
import {ModalProvider} from "@/providers/modal-provider.tsx";

export function Layout({children}: { children: React.ReactNode }) {

    return (
        <>
            {children}
            <ModalProvider/>
        </>
    );
}
