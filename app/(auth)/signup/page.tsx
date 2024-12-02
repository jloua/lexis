import { SignUpForm } from "@/app/components/forms/SignUpForm";
import Link from "next/link";

export default function Signup() {
    return (
        <main>
            <h2>Sign up</h2>

            <SignUpForm />

            <p className="font-sofiaPro mb-4 text-2xl">Already have an account?</p>
            <Link href="/login">Log in</Link>
        </main>
    );
}
