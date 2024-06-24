import { useEffect, useState } from "react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon, Search } from "lucide-react";
import useModalProject from "@/hooks/use-modal-minor.ts";

export default function UsersList() {
    const [imageURL, setImageURL] = useState("");

    const openModal = useModalProject((state) => state.openModal);

    useEffect(() => {
        
        setImageURL("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYNz-Rl2DDDKLZ2YpxFoZyJTEy1iLNKnPbcA&s");
    }, []);

    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" className='font-semibold'>Inicio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>Bienvenido</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-start mb-2">Bienvenido a la pagina de inicio</h1>
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                        <Input className="pr-10" placeholder="Buscar..." />
                        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    
                    <Button size='sm' onClick={() => openModal({})}>
                        <PlusIcon size={15} className="mr-2"/> Login
                    </Button>

                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                    <img src={imageURL} alt="Placeholder"  style={{ width: "100%", height: "auto", maxWidth: "250px", margin: "0 auto" }}/>
                </div>
            </div>
        </>
    );
}
