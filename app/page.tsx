import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h2>Learn</h2>

      <div className="flex flex-row gap-8 justify-center mb-12">
        <span>TRANSLATE</span>
        <span>SIMPLIFY</span>
      </div>

      <div className="flex flex-col gap-4">
        <Link href="/signup">Sign up</Link>
        <Link href="/login">Log in</Link>
      </div>
    </main>
  );
}
