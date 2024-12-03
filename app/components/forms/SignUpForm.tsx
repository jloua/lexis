"use client"

import useAuth from "@/app/hooks/useAuth";
import useSignupLoading from "@/app/hooks/useSignupLoading";
import { SignupFormFieldsType, signupFormSchema } from "@/app/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export const SignUpForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset } = useForm<SignupFormFieldsType>({ resolver: zodResolver(signupFormSchema) });
    const { signupWEmail } = useAuth();
    const { isLoading, setIsLoading } = useSignupLoading();
    const router = useRouter();

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
                    <input type="password" id="password" className="w-full" {...register("password")} />
                    {errors.password && (
                        <span className="error">{errors.password.message}</span>
                    )}
                </label>
            </fieldset>

            <fieldset className="w-full text-start">
                <label htmlFor="confirmPassword">Confirm Password
                    <input type="password" id="confirmPassword" className="w-full" {...register("confirmPassword")} />
                    {errors.confirmPassword && (
                        <span className="error">{errors.confirmPassword.message}</span>
                    )}
                </label>
            </fieldset>

            <button type="submit" className="w-full mt-4" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create account"}</button>
            {errors.root && (
                <span className="error">{errors.root.message}</span>
            )}
        </form>
    )
}
