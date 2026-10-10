"use client";

import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/Button";
import { SquareArrowOutUpRight } from "lucide-react";

export default function UserPage() {
	return (
		<>
			<Header role="user" username="nico" />
			<main className="min-h-screen flex items-center justify-center">
				<Button className="h-25 text-lg bg-chart-2 hover:bg-chart-4">Working space <SquareArrowOutUpRight /></Button>
			</main>
		</>
	);
}
