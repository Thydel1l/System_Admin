import FullScreenLoader from "@/components/loader.tsx";
import React, {Suspense} from "react";

const MajorList = React.lazy(() => import('./major-list.tsx'));

export const Majors = () => {
    return (
        
        <div>
            <Suspense fallback={<FullScreenLoader/>}>
                <MajorList/>
            </Suspense>
        </div>
        
    )
}
