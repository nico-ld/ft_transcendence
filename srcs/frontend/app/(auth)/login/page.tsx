"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState("");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault(); 
		const data = new FormData(e.currentTarget);

		const result = await login(
			String(data.get("email")),
			String(data.get("password"))
		);

		if (!result) {
			setError("Invalid credentials");
			return ;
		}
		router.push(result.role === "admin" ? "/admin" : "/dashboard");
	}

	return (
		<main className="min-h-screen flex items-center justify-center">
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input name="email" type="email" placeholder="Email" required />
				<input name="password" type="password" placeholder="Password" required />
				{error && <p className="text-red-500">Error</p>}
				<button type="submit">Log in</button>
			</form>
		</main>
	);
}
