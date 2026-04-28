import { Outlet } from "react-router-dom";

export default function MasterGrid() {
    return (
        <div className="flex ">
            <Outlet/>
        </div>
    )
}
