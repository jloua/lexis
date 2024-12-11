"use client"

import useAuth from "@/app/hooks/useAuth";
import useAuthLoading from "@/app/hooks/useAuthLoading";
import { SignupFormFieldsType, signupFormSchema } from "@/app/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { Icon } from "../Icon";
import { useState } from "react";

export const SignUpForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset } = useForm<SignupFormFieldsType>({ resolver: zodResolver(signupFormSchema) });
    const { signupWEmail } = useAuth();
    const { isLoading, setIsLoading } = useAuthLoading();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit: SubmitHandler<SignupFormFieldsType> = async (data) => {
        setIsLoading(true);
        try {
            await signupWEmail(data.email, data.password);
            reset();
            router.push("/");
        } catch (error) {
            if (error instanceof FirebaseError || error instanceof Error) {
                setError("root", error)
            } else {
                setError("root", new Error("Something went wrong, try again."))
            }
        }
        setIsLoading(false);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`w-full flex flex-col gap-4 items-start my-6 ${isLoading && "pointer-events-none opacity-50"}`}>
            <fieldset className="w-full text-start">
                <label htmlFor="email">Email
                    <input type="email" id="email" className="w-full" {...register("email")} />
                    {errors.email && (
                        <span className="error">{errors.email.message}</span>
                    )}
                </label>
            </fieldset>

            <fieldset className="w-full text-start">
                <label htmlFor="password">Password
                    <div className="relative">
                        <input type={showPassword ? "text" : "password"} id="password" className="w-full" {...register("password")} />
                        <span className="absolute top-2 right-3" onClick={() => setShowPassword(!showPassword)}><Icon type={showPassword ? "eye" : "eye-closed"} /></span>
                    </div>
                    {errors.password && (
                        <span className="error">{errors.password.message}</span>
                    )}
                </label>
            </fieldset>

            <fieldset className="w-full text-start">
                <label htmlFor="confirmPassword">Confirm Password
                    <div className="relative">
                        <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" className="w-full" {...register("confirmPassword")} />
                        <span className="absolute top-2 right-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}><Icon type={showConfirmPassword ? "eye" : "eye-closed"} /></span>
                    </div>
                    {errors.confirmPassword && (
                        <span className="error">{errors.confirmPassword.message}</span>
                    )}
                </label>
            </fieldset>

            <button type="submit" className="btn-primary w-full mt-4" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</button>
            {errors.root && (
                <span className="error">{errors.root.message}</span>
            )}
        </form>
    )
}
