import FullScreenLoader from "../loader.tsx";
import React, {Suspense} from "react";

const MinorList = React.lazy(() => import('./minor-list.tsx'));

export const Minors = () => {
    return (
        <div>
            <Suspense fallback={<FullScreenLoader/>}>
                <MinorList/>
            </Suspense>
        </div>
    )
}
