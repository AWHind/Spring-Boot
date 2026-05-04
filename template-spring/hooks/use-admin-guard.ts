"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

/**
 * 🔐 Hook يحمي صفحات Admin
 * - إذا user موش موجود → يستنى
 * - إذا موش ADMIN → يردّو login
 * - يرجّع user إذا OK
 */
export function useAdminGuard() {

    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {

        // ⏳ نستناو auth يكمّل
        if (isLoading) return;

        // ❌ موش logged in
        if (!user) {
            router.push("/login");
            return;
        }

        // ❌ موش admin
        if (user.role !== "ADMIN") {
            router.push("/login");
        }

    }, [user, isLoading, router]);

    return {
        user,
        isLoading,
        isAdmin: user?.role === "ADMIN"
    };
}