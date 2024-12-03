import { SignUpForm } from "@/app/components/forms/SignUpForm";
import { SocialSignupButtons } from "@/app/components/SocialSignupButtons";
import { SignupLoadingProvider } from "@/app/contexts/SignupLoadingContextProvider";
import Link from "next/link";

export default function Signup() {
    return (
        <main>
            <h2>Sign up</h2>
            <p className="font-sofiaPro mb-2 text-xl">Already have an account?</p>
            <Link href="/login" className="underline text-sm">Log in</Link>

            <SignupLoadingProvider>
                <SignUpForm />
                <p className="mt-12 mb-6">Or sign up with social account</p>
                <SocialSignupButtons />
            </SignupLoadingProvider>
        </main>
    );
}
