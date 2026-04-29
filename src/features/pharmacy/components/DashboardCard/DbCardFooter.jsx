import { twMerge } from "tailwind-merge";

// propClassName is used to overwrite some of the container button tailwind css classes
export default function DbCardFooter({ children, propClassName = "" }) {
    return (
        <button className={twMerge(
            "text-brand-primary/75 w-fit font-medium hover:text-brand-primary transition",
            propClassName
        )}>
            {children}
        </button>
    )
}
