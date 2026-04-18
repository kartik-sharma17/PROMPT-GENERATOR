"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "@/reduxConfig/slice/authSlice";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/", "/signup", "/choose-plan", "/verify", "/verify-account", "/forget-password", "/reset-password", "/about-us", "/contact-us"];


export default function AuthWatcher({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const path = usePathname();

    const isPublicRoute = (pathname: string) => {
        return (
            PUBLIC_ROUTES.includes(pathname) ||
            pathname.startsWith("/verify-account/")
        );
    };

    useEffect(() => {
        const checkToken = () => {
            const token = Cookies.get("token");

            const manualLogout = localStorage.getItem("manualLogout") === "true";

            if (!token) {
                if (!manualLogout && !isPublicRoute(path)) {
                    toast.warning("Session expired, please login again");
                }

                localStorage.removeItem("manualLogout");

                dispatch(logout());
            }
        };

        checkToken();
        window.addEventListener("focus", checkToken);

        return () => window.removeEventListener("focus", checkToken);
    }, [path, dispatch]);

    return children;
}