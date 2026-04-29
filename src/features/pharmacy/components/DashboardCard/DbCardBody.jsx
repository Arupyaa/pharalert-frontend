import { twMerge } from 'tailwind-merge';

/*
should only be used for 1 sectioned dashboard, use DbBodySection for 2-4 sections array prop
content is an array prop with label, value, className for both to modify its existing tailwind classes
col is a boolean prop when false it displays it horizontally, true displays it vertically
orderReverse is a boolean prop when true reverse the order of the elements to display value before the label
divClassName is a special prop to optionally change the container div styling to adjust stuff like gap
*/

export default function DbCardBody({ content = {}, col = false, orderReverse = false, divClassName = "" }) {
    return (

        <div className="w-full">
            {/* Stats section */}
            <div
                className={twMerge(
                    "flex justify-center items-start gap-x-6 gap-y-4",
                    col && "flex-col",
                    divClassName
                )}>

                {content.label && <h2 className={twMerge(
                    "text-3xl font-bold text-center text-heading",
                    orderReverse ? "order-2" : "order-1",
                    content.labelClassName
                )}>
                    {content.label}
                </h2>}

                {content.value && <p className={twMerge(
                    "text-3xl text-center text-paragraph",
                    orderReverse ? "order-1" : "order-2",
                    content.valueClassName
                )}>
                    {content.value}
                </p>}


            </div>
            {/* Divider */}
            <div className="border-t border-border-primary mt-5"></div>
        </div>
    )
}
