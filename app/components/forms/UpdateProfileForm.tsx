"use client";

import useAuth from '@/app/hooks/useAuth';
import { UpdateProfileFormFieldsType, updateProfileFormSchema, UserType } from '@/app/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { SubmitHandler, useForm } from 'react-hook-form';
import { addFile } from '@/app/services/firebase/storage';
import { Icon } from '../Icon';

interface Props {
    onPhotoUpdated: () => void;
}

export const UpdateProfileForm = ({ onPhotoUpdated }: Props) => {
    const { currentUser, reloadUser, updateUserProfile } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<UpdateProfileFormFieldsType>({
        defaultValues: {
            email: currentUser?.email ?? "",
            displayName: currentUser?.displayName ?? "",

        }, resolver: zodResolver(updateProfileFormSchema)
    });

    const onSubmit: SubmitHandler<UpdateProfileFormFieldsType> = async (data) => {
        if (!currentUser) {
            setError("root", new Error("You must be logged in to update profile info."))
            return;
        }

        const updatedData: UserType = {
            email: data.email,
            displayName: data.displayName,
        };

        if (data.profilePhoto?.length) {
            updatedData.photoUrl = await addFile(data.profilePhoto, currentUser);
        }

        try {
            await updateUserProfile(updatedData);
            await reloadUser();

            if (updatedData.photoUrl) {
                onPhotoUpdated();
            }
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
            <div className="relative w-full text-start">
                <label htmlFor="displayName">Upload photo</label>
                <input type="file" accept="image/gif,image/jpeg,image/png,image/webp,image/avif" id="profilePhoto" className="w-full" {...register("profilePhoto")} />
                <span className="absolute text-dark top-10 right-3"><Icon type="pen" /></span>
            </div>

            <fieldset className="w-full text-start">
                <label htmlFor="displayName">Username
                    <div className="relative">
                        <input type="text" id="displayName" className="w-full" {...register("displayName")} />
                        <span className="absolute text-dark top-3 right-3"><Icon type="pen" /></span>
                    </div>
                    {errors.displayName && (
                        <span className="error">{errors.displayName.message}</span>
                    )}
                </label>
            </fieldset>

            <fieldset className="w-full text-start">
                <label htmlFor="email">Email
                    <div className="relative">
                        <input type="email" id="email" className="w-full" {...register("email")} />
                        <span className="absolute text-dark top-3 right-3"><Icon type="pen" /></span>
                    </div>
                    {errors.email && (
                        <span className="error">{errors.email.message}</span>
                    )}
                </label>
            </fieldset>

            <button type="submit" className="btn-primary w-full mt-4" disabled={isSubmitting}>{isSubmitting ? "Updating account..." : "Update account"}</button>
            {errors.root && (
                <span className="error">{errors.root.message}</span>
            )}
        </form>
    )
}
