import FullScreenLoader from "../loader.tsx";
import React, {Suspense} from "react";

const ProjectList = React.lazy(() => import('./project-list.tsx'));

export const Projects = () => {
    return (
        <div>
            <Suspense fallback={<FullScreenLoader/>}>
                <ProjectList/>
            </Suspense>
        </div>
    )
}
