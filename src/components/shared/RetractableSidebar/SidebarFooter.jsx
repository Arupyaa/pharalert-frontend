import AvatarWithName from "../AvatarWithName.jsx";
import Avatar from "../Avatar.jsx";

import { useAvatarStore } from "../../../store/UseAvatarStore.js";

export default function SidebarFooter({collapsed}) {
    const {avatar} = useAvatarStore();
    return (
        <div className={`py-4 px-2 ${collapsed && 'flex justify-center'}`} >
            {!collapsed ?
                <AvatarWithName avatarImg={avatar.image} avatarName={avatar.name} /> :
                <Avatar avatarImg={avatar.image} avatarName={avatar.name}/>
            }

        </div>
    )
}
