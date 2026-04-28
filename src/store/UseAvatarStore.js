import { create } from "zustand";
//global store state to manage User Profile Avatar
export const useAvatarStore = create((set)=>({
    avatar: {name:'Avatar',image:null},
    changeAvatarName: (name)=> 
        set((state)=> ({
            avatar: {...state.avatar,name:name}
        })
        ),
    
    changeAvatarImage: (image)=>
        set((state)=>({
            avatar: { ...state.avatar,image:image}
        })
        )
}));