"use client";

import React, { createContext, useState } from "react";
import { SignupLoadingContextType } from "../types/user";

export const SignupLoadingContext = createContext<SignupLoadingContextType | null>(null);

export const SignupLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <SignupLoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </SignupLoadingContext.Provider>
    );
};