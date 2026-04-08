"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout } from "@/reduxConfig/slice/authSlice";
import { toast } from "sonner";

export default function AuthWatcher({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkToken = () => {
            const token = Cookies.get("token");

            const manualLogout = localStorage.getItem("manualLogout") === "true";

            if (!token) {
                // If user manually logged out → do NOT show toast
                if (!manualLogout) {
                    toast.warning("Session expired, please login again");
                }

                // Clear flag after handling
                localStorage.removeItem("manualLogout");

                dispatch(logout());
            }
        };

        checkToken();
        window.addEventListener("focus", checkToken);

        return () => window.removeEventListener("focus", checkToken);
    }, []);

    return children;
}