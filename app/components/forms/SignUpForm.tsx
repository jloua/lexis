"use client"

import useAuth from "@/app/hooks/useAuth";
import { useRouter } from 'next/navigation'

export const SignUpForm = () => {
    const { signupWGoogle } = useAuth();
    const router = useRouter();

    const handleClick = async () => {
        const userCredentials = await signupWGoogle();
        console.log(userCredentials)
        router.push("/")
    }
    return (
        <div>
            <button type="button" onClick={handleClick}>Google</button>
        </div>
    )
}
