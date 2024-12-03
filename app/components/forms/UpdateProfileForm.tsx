"use client";

import useAuth from '@/app/hooks/useAuth';
import { UpdateProfileFormFieldsType, updateProfileFormSchema } from '@/app/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const UpdateProfileForm = () => {
    const { currentUser, reloadUser, updateUserProfile } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<UpdateProfileFormFieldsType>({
        defaultValues: {
            email: currentUser?.email ?? "",
            displayName: currentUser?.displayName ?? "",
            photoUrl: currentUser?.photoURL ?? "",
        }, resolver: zodResolver(updateProfileFormSchema)
    });

    const onSubmit: SubmitHandler<UpdateProfileFormFieldsType> = async (data) => {
        try {
            await updateUserProfile(data);
            await reloadUser();
        } catch (error) {
            if (error instanceof FirebaseError || error instanceof Error) {
                setError("root", error)
            } else {
                setError("root", new Error("Something went wrong trying to update profile info."))
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`update-form w-full flex flex-col gap-4 items-start my-6 ${isSubmitting && "pointer-events-none opacity-50"}`}>
            <fieldset className="w-full text-start">
                <label htmlFor="photoUrl">Photo
                    <input type="file" accept="image/gif,image/jpeg,image/png,image/webp,image/avif" id="photoUrl" className="w-full" {...register("photoUrl")} />
                    {errors.photoUrl && (
                        <span className="error">{errors.photoUrl.message}</span>
                    )}
                </label>
            </fieldset>

            <fieldset className="w-full text-start">
                <label htmlFor="displayName">Username
                    <input type="text" id="displayName" className="w-full" {...register("displayName")} />
                    {errors.displayName && (
                        <span className="error">{errors.displayName.message}</span>
                    )}
                </label>
            </fieldset>

            <fieldset className="w-full text-start">
                <label htmlFor="email">Email
                    <input type="email" id="email" className="w-full" {...register("email")} />
                    {errors.email && (
                        <span className="error">{errors.email.message}</span>
                    )}
                </label>
            </fieldset>

            <button type="submit" className="w-full mt-4" disabled={isSubmitting}>{isSubmitting ? "Updating account..." : "Update account"}</button>
            {errors.root && (
                <span className="error">{errors.root.message}</span>
            )}
        </form>
    )
}
