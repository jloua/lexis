"use client";

import React, { createContext, useState } from "react";
import { AuthLoadingContextType } from "../types/user";

export const AuthLoadingContext = createContext<AuthLoadingContextType | null>(null);

export const AuthLoadingContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <AuthLoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </AuthLoadingContext.Provider>
    );
};