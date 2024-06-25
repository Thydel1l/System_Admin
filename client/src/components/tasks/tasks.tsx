import FullScreenLoader from "../loader.tsx";
import React, {Suspense} from "react";

const TaskList = React.lazy(() => import('./task-list.tsx'));

export const Tasks = () => {
    return (
        <div>
            <Suspense fallback={<FullScreenLoader/>}>
                <TaskList/>
            </Suspense>
        </div>
    )
}
