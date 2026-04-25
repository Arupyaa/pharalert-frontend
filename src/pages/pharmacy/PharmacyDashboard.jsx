import RetractableSidebar from "../../components/shared/RetractableSidebar";
import PDashboardMain from "../../features/pharmacy/components/PDashboardMain";

export default function PharmacyDashboard() {
    return (
        //main container 12-col system
        <>
            <RetractableSidebar/>
            <PDashboardMain/>
        </>
    )
}
