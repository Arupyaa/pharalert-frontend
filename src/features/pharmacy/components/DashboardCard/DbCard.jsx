import { twMerge } from "tailwind-merge";

export default function DbCard({children,propClassName=""}) {
    return (
        <div  className={twMerge(
            "bg-neutral-main max-w-sm p-6 rounded-xl shadow-md hover:bg-neutral-secondary flex flex-col gap-2 justify-start",
            propClassName
        )}>
            {children}
        </div>
    )
}
