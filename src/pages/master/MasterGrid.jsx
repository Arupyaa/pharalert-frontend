import { Outlet } from "react-router-dom";

export default function MasterGrid() {
    return (
        <div className="grid grid-cols-12 gap-x-5">
            <Outlet/>
        </div>
    )
}
