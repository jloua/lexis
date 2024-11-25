import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Mono } from 'next/font/google'
import Link from "next/link";
import "./globals.css";

const sofiaPro = localFont({
	src: "./fonts/SofiaPro.otf",
	variable: "--font-sofia-pro",
});

const spaceMono = Space_Mono({
	subsets: ['latin'],
	variable: '--font-space-mono',
	display: 'swap',
	weight: ['400', '700'],
})

export const metadata: Metadata = {
	title: "Lexis",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="https://fav.farm/💬" />
			</head>
			<body
				className={`${spaceMono.variable} ${sofiaPro.variable} antialiased`}
			>
				<div className="flex flex-row justify-between">
					<div className="text-darkBlue">
						<h1>lexis</h1>
						<p className="text-[8px]">
							Simplify language,
							<br />
							amplify understanding
						</p>
					</div>

					<div className="flex flex-row gap-2">
						<Link href="/signup">Sign up</Link>
						<Link href="/login">Log in</Link>
					</div>
				</div>

				{children}
				<nav className="flex flex-row justify-between pb-4">
					<Link href="/">Learn</Link>
					<Link href="/practice">Practice</Link>
					<Link href="/profile">Profile</Link>
				</nav>
			</body>
		</html>
	);
}
