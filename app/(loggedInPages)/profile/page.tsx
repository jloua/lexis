"use client";

import { UpdateProfileForm } from "@/app/components/forms/UpdateProfileForm";
import useAuth from "@/app/hooks/useAuth";
import Image from "next/image";
// import { useRouter } from "next/navigation";

export default function Profile() {
    const { currentUser, userPhotoUrl,
        // logout 
    } = useAuth();
    // const router = useRouter();

    // const handleClick = () => {
    //     logout();
    //     router.push("/login");
    // }

    return (
        <main className="pt-2">
            <h2 className="hidden">Profile</h2>

            {!currentUser && (
                <div><p>You must be logged in to access this page</p></div>
            )}

            {currentUser && (
                <>
                    <Image
                        src={userPhotoUrl || "https://via.placeholder.com/200"}
                        alt="Profile picture"
                        width={150}
                        height={150}
                        className="rounded-full mx-auto mb-4"
                    />
                    <h3>{currentUser.displayName ?? currentUser.email}</h3>

                    <UpdateProfileForm />

                    {/* <button onClick={handleClick}>Log out</button> */}
                </>
            )}
        </main>
    );
}
