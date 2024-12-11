"use client";

import React, { useState } from 'react'
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from 'next/navigation'
import useAuthLoading from '../hooks/useAuthLoading';
import { FirebaseError } from 'firebase/app';

export const GoogleButton = () => {
    const { signupWGoogle } = useAuth();
    const router = useRouter();
    const { isLoading, setIsLoading } = useAuthLoading();
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
        <>
            <button type="button" title="Sign in with Google account" className={`btn-secondary flex flex-row gap-4 mx-auto items-center ${isLoading && "pointer-events-none opacity-50"}`} onClick={handleClick}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.7419 8.1871C15.7419 12.7516 12.6161 16 8 16C3.57419 16 0 12.4258 0 8C0 3.57419 3.57419 0 8 0C10.1548 0 11.9677 0.790323 13.3645 2.09355L11.1871 4.1871C8.33871 1.43871 3.04194 3.50323 3.04194 8C3.04194 10.7903 5.27097 13.0516 8 13.0516C11.1677 13.0516 12.3548 10.7806 12.5419 9.60323H8V6.85161H15.6161C15.6903 7.26129 15.7419 7.65484 15.7419 8.1871Z" fill="currentColor" />
                </svg>
                <span>Google</span>
            </button>
            {error && (
                <span className="error">{error}</span>
            )}
        </>
    )
}
