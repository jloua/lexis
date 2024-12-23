"use client";

import { FirebaseError } from "firebase/app";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { useState } from "react";
import { Icon } from "./Icon";
import { useRouter } from "next/navigation";

export const DeleteUserButton = ({ userId }: { userId: string }) => {
    const { deleteUserCompletely, error, loading } = useDeleteUser(userId);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const router = useRouter();

    const handleDeleteClick = async () => {
        await deleteUserCompletely();
        router.push("/signup");
    }

    if (error) {
        return (
            <span className="error">{error instanceof FirebaseError ? error.message : error}</span>
        );
    }

    return (
        <>
            <div className="relative mt-8 group flex justify-center items-center text-darkBlue">
                <button onClick={() => setIsDeleteModalOpen(true)} className=" text-btn transition-all duration-300 ease-in-out group-hover:pr-6">Delete account</button>

                <span className="absolute right-28 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                    <Icon type="delete" />
                </span>
            </div>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-offWhite p-6 rounded-lg shadow-lg w-11/12 max-w-md">
                        <button
                            className="absolute top-[13.25rem] right-[1.75rem] md:right-[20.5rem] w-8 h-8 bg-light border border-dark rounded-full"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            &times;
                        </button>
                        <div className="mt-4">
                            <h4>Delete account</h4>
                            <p className="p-4 text-start">This action cannot be reversed. If you still want to delete your account including all your search history, press delete.</p>
                            <button className="btn-primary" onClick={handleDeleteClick} disabled={loading}>{loading ? "Deleting..." : "Delete"}</button>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}
