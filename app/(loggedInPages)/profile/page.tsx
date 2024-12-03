"use client";

import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const router = useRouter();

    const handleClick = () => {
        logout();
        router.push("/login");
    }

    return (
        <main>
            <h2 className="hidden">Profile</h2>

            {!currentUser && (
                <div><p>You must be logged in to access this page</p></div>
            )}

            {currentUser && (
                <>
                    <h3>{currentUser.displayName ?? currentUser.email}</h3>
                    <button onClick={handleClick}>Log out</button>
                </>
            )}
        </main>
    );
}
