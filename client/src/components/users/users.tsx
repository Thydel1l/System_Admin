import FullScreenLoader from "@/components/loader.tsx";
import React, {Suspense} from "react";

const UsersList = React.lazy(() => import('./users-list.tsx'));

export const Users = () => {
    return (
        <div>
            <Suspense fallback={<FullScreenLoader/>}>
                <UsersList/>
            </Suspense>
        </div>
    )
}
