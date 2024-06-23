import './App.css'
import '../app/globals.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {Users} from "@/components/users/users.tsx";
import Home from "@/components/home.tsx";
import {Layout} from "@/components/layout.tsx";
import {Projects} from "@/components/projects/projects.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Home/>
        ),
    },
    {
        path: "/users",
        element: (
            <Layout>
                <Users/>
            </Layout>

        ),
    },
    {
        path: "/projects",
        element: (
            <Layout>
                <Projects/>
            </Layout>

        ),
    },
]);


function App() {

    return (
        <>
            <RouterProvider router={router}/>
        </>
    )
}

export default App
