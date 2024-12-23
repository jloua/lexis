"use client";

import Link from "next/link";
import useAuth from "../hooks/useAuth"

const Navbar = () => {
    const { currentUser } = useAuth();

    return (
        <nav className="flex flex-row justify-between p-4 fixed bottom-0 left-0 right-0 w-full bg-offWhite md:px-16">
            <Link href="/" className="hover:scale-105 transition duration-300 ease-in-out">Learn</Link>
            {currentUser && (
                <>
                    <Link href="/practice" className="hover:scale-105 transition duration-300 ease-in-out">Practice</Link>
                    <Link href="/profile" className="hover:scale-105 transition duration-300 ease-in-out">Profile</Link>
                </>
            )}
        </nav>
    )
}

export default Navbar
