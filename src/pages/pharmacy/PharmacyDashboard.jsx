import RetractableSidebar from "../../components/shared/RetractableSidebar";
import PDashboardMain from "../../features/pharmacy/components/PDashboardMain";

export default function PharmacyDashboard() {
    return (
        //main container 12-col system
        <div className="grid grid-cols-12 gap-x-5">
            <RetractableSidebar/>
            <PDashboardMain/>
        </div>
    )
}
