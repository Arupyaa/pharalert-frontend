import AvatarWithName from "../AvatarWithName.jsx";
import Avatar from "../Avatar.jsx";
import avatarImage from "../../../assets/avatar.avif"

export default function SidebarFooter({collapsed}) {
    return (
        <div className={`py-4 px-2 ${collapsed && 'flex justify-center'}`} >
            {!collapsed ?
                <AvatarWithName avatarImg={null} avatarName={'Ahmed Ezzat'} /> :
                <Avatar avatarImg={null} />
            }

        </div>
    )
}
