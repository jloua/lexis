"use client"

import Link from 'next/link'
import { useRouter } from "next/navigation";
import useAuth from '../hooks/useAuth'

export const Header = () => {
    const { currentUser, logout } = useAuth();
    const router = useRouter();

    const handleClick = () => {
        logout();
        router.push("/login");
    }

    return (
        <div className="flex flex-row justify-between items-start">
            <Link href="/">
                <div className="text-darkBlue transition duration-300 ease-in-out hover:scale-105">
                    <h1>lexis</h1>
                    <p className="text-[8px]">
                        Simplify language,
                        <br />
                        amplify understanding
                    </p>
                </div>
            </Link>
            {currentUser && (
                <div className="relative group flex justify-end items-center text-darkBlue">
                    <button className="text-btn transition-all duration-300 ease-in-out group-hover:pr-6" onClick={handleClick}>Log out</button>
                    <svg className="absolute right-0 -rotate-90 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out" width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.695895 1.80319L0.6959 1.8032L0.697791 1.80131L1.80131 0.697792C2.06608 0.433019 2.49021 0.435752 2.74759 0.695896L2.74758 0.695901L2.74947 0.697792L7.45651 5.40482L7.81006 5.75838L8.16361 5.40482L12.8706 0.697792C13.1354 0.433019 13.5595 0.435752 13.8169 0.695901L13.8188 0.697792L14.9223 1.80131C15.1871 2.06608 15.1844 2.49021 14.9242 2.74758L14.9223 2.74947L8.2817 9.3901L8.28168 9.39008L8.27792 9.39392C8.02688 9.65042 7.60427 9.65595 7.33842 9.3901L0.697791 2.74947C0.433018 2.4847 0.435751 2.06057 0.695895 1.80319Z" fill="currentColor" />
                    </svg>
                </div>
            )}
        </div>
    )
}
