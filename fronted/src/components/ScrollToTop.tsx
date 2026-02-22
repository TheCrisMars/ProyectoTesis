import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        const scroll = () => {
            if (hash) {
                const id = hash.replace("#", "");
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ block: "start" });
                    return;
                }
            }

            window.scrollTo(0, 0);
        };

        requestAnimationFrame(scroll);
    }, [pathname, hash]);

    return null;
}
