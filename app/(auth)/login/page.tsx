import Link from "next/link";

export default function Login() {
    return (
        <main>
            <h2>Log in</h2>

            <p className="font-sofiaPro mb-4 text-2xl">Or create an account</p>
            <Link href="/signup">Sign up</Link>
        </main>
    );
}
