"use client";

import Link from "next/link";
import useAuth from "../hooks/useAuth"

const Navbar = () => {
    const { currentUser } = useAuth();

    return (
        <nav className="flex flex-row justify-between pb-4">
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
