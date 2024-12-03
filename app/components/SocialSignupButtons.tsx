"use client";

import React, { useState } from 'react'
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from 'next/navigation'
import useSignupLoading from '../hooks/useSignupLoading';
import { FirebaseError } from 'firebase/app';

export const SocialSignupButtons = () => {
    const { signupWGoogle } = useAuth();
    const router = useRouter();
    const { isLoading, setIsLoading } = useSignupLoading();
    const [error, setError] = useState<string | null>(null)

    const handleClick = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await signupWGoogle();
            router.push("/")

        } catch (error) {
            if (error instanceof FirebaseError || error instanceof Error) {
                setError(error.message)
            } else {
                setError("Something went wrong, try again.")
            }
        }
        setIsLoading(false)
    }

    return (
        <div className={`w-full flex justify-between gap-8 ${isLoading && "pointer-events-none opacity-50"}`}>
            <button type="button" className="btn-secondary w-full" onClick={handleClick}>Google</button>
            <button type="button" className="btn-secondary w-full" onClick={handleClick}>Facebook</button>
            {error && (
                <span className="error">{error}</span>
            )}
        </div>
    )
}
