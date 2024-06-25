import FullScreenLoader from "../loader.tsx";
import React, {Suspense} from "react";

const ArchiveList = React.lazy(() => import('./archive-list.tsx'));

export const Archives = () => {
    return (
        <div>
            <Suspense fallback={<FullScreenLoader/>}>
                <ArchiveList/>
            </Suspense>
        </div>
    )
}
