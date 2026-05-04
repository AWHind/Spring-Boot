"use client";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext";
import { AuthPersist } from "@/components/auth/AuthPersist";

export const Providers = ({ children }: any) => {
    return (
        <AuthProvider>
            <AuthPersist />

            <CartProvider>
                <OrderProvider>{children}</OrderProvider>
            </CartProvider>
        </AuthProvider>
    );
};