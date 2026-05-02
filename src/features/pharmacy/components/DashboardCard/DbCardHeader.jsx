import { twMerge } from "tailwind-merge";

// propClassName is used to overwrite some of the container div tailwind css classes
export default function DbCardHeader({children, propClassName=""}) {
  return (
    <div className={twMerge(
      "text-lg  tracking-tight text-muted leading-8 flex flex-col",
      propClassName
    )}>
    {children}
    </div>
  )
}
