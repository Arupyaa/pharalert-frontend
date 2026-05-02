import AvatarWithName from "../../../components/shared/AvatarWithName";

export default function DashboardNavBar({propClassName=''}) {
  return (
    <div className={`w-full bg-neutral-main h-[60px] shadow-sm flex justify-between items-center px-6 ${propClassName}`}>
        {/* div to replace with search bar later */}
        <div></div> 
        {/* avatar section */}
        <div>
            <AvatarWithName/>
        </div>
    </div>
  )
}
