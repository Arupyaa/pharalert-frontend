import React from 'react'
import { twMerge } from 'tailwind-merge';

/*
should only be used for 2-4 sectioned dashboard, would get bugged if you use 4+ and looks ugly on 1 section better use DbCardBody for that
content is an array prop with label, value, className for both to modify its existing tailwind classes
containingDivClassName is a special key inside content array to optionally change the alignment and padding of the element in the grid
*/

export default function DbCardBodySection({ content = [] }) {
    const gridCols = {
        // 1: "grid-cols-1",
        2: "grid-cols-[auto_auto]",
        3: "grid-cols-[auto_auto_auto]",
        4: "grid-cols-[auto_auto_auto_auto]",
    };

    return (
        <div className="w-full">
            {/* content section */}
            <div
                className={`grid ${gridCols[content.length] || "grid-cols-1"} items-center`}
            >
                {content.map((item, index) => (
                    <div
                        key={index}
                        className={twMerge(
                            `w-full`,
                            index == 0 ? 'pr-4' :
                                index == content.length - 1 ? 'pl-4' : 'px-4',
                            index !== content.length - 1
                                ? "border-r border-border-primary"
                                : "",
                            item.containingDivClassName
                        )}
                    >
                        {item.value&&<h2 className={twMerge(
                            "text-3xl font-bold text-center text-heading",
                            item.labelClassName
                        )}>
                            {item.value}
                        </h2>}

                        {item.label&&<p className={twMerge(
                            "text-sm text-center text-paragraph",
                            item.valueClassName
                        )}>
                            {item.label}
                        </p>}
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="border-t border-border-primary mt-5"></div>


        </div>
    );
};
