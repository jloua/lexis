"use client";

import { UpdateProfileForm } from "@/app/components/forms/UpdateProfileForm";
import useAuth from "@/app/hooks/useAuth";
import Image from "next/image";

export default function Profile() {
    const { currentUser,
        userPhotoUrl,
        reloadUser
    } = useAuth();

    const handlePhotoUpdated = async () => {
        await reloadUser();
    };

    return (
        <main className="pt-2">
            <h2 className="hidden">Profile</h2>

            {!currentUser && (
                <div><p>You must be logged in to access this page</p></div>
            )}

            {currentUser && (
                <>
                    <div className="relative w-36 h-36 mx-auto mb-4">
                        <Image
                            src={userPhotoUrl || "https://via.placeholder.com/200"}
                            alt="Profile picture"
                            fill
                            sizes="100%"
                            style={{ objectFit: "cover" }}
                            className="rounded-full"
                        />
                    </div>

                    <h3>{currentUser.displayName ?? currentUser.email}</h3>

                    <UpdateProfileForm onPhotoUpdated={handlePhotoUpdated} />
                </>
            )}
        </main>
    );
}
