"use client";

import Link from "next/link";
import useAuth from "../hooks/useAuth"

const Navbar = () => {
    const { currentUser } = useAuth();

    return (
        <nav className="flex flex-row justify-between p-4 fixed bottom-0 left-0 right-0 w-full bg-offWhite">
            <Link href="/">Learn</Link>
            {currentUser && (
                <>
                    <Link href="/practice">Practice</Link>
                    <Link href="/profile">Profile</Link>
                </>
            )}

        </nav>
    )
}

export default Navbar
