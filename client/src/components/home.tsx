import {Link} from 'react-router-dom';
import {User2} from "lucide-react"
import useModalMinor from "../hooks/use-modal-minor.ts";
import {Button} from "./ui/button.tsx";

const Home = () => {
    const userId = ''
    const openModal = useModalMinor((state) => state.openModal);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Maneja tus proyectos y tareas
            </h1>
            <p className="text-md text-gray-500 mt-4">
                Aquí podrás crear, editar y eliminar tus proyectos y tareas.
            </p>

            <Button onClick={() => openModal({})}
                    className="flex items-center mt-8 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition
                  duration-300 ease-in-out transform hover:-translate-y-1">
                <User2 size={18} className="text-purple-400"/>
                <span className="px-3 text-purple-400">Ver usuarios</span>
            </Button>
            <Link to="/projects"
                  className="flex items-center mt-8 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition
                  duration-300 ease-in-out transform hover:-translate-y-1">
                <User2 size={18} className="text-purple-400"/>
                <span className="px-3 text-purple-400">Ver proyectos</span>
            </Link>
            <Link to="/tasks"
                  className="flex items-center mt-8 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition
                  duration-300 ease-in-out transform hover:-translate-y-1">
                <User2 size={18} className="text-purple-400"/>
                <span className="px-3 text-purple-400">Ver tareas</span>
            </Link>

        </div>
    );
};

export default Home;
