import './App.css'
import '../app/globals.css'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {Users} from "./components/users/users.tsx";
import Home from "./components/home.tsx";
import {Layout} from "./components/layout.tsx";
import {Projects} from "./components/projects/projects.tsx";
import {Minors} from "./components/minors/minors.tsx";
import {Tasks} from "./components/tasks/tasks.tsx";
import {Archives} from "./components/archives/archives.tsx";
import Login from "./components/minors/login.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Login/>
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

    {
        path: "/majors",
        element: (
            <Layout>
                <Projects/>
            </Layout>

        ),
    },

    {
        path: "/minors",
        element: (
            <Layout>
                <Minors/>
            </Layout>

        ),
    },

    {
        path: "/tasks",
        element: (
            <Layout>
                <Tasks/>
            </Layout>

        ),
    },

    {
        path: "/archives",
        element: (
            <Layout>
                <Archives/>
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
