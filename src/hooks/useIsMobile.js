import { useEffect, useState } from "react";
//custom hook to detect screen size is mobile or not
export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(
        window.matchMedia("(max-width: 640px)").matches
    );

    useEffect(() => {
        const media = window.matchMedia("(max-width: 640px)");

        const listener = () => setIsMobile(media.matches);

        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, []);

    return isMobile;
}