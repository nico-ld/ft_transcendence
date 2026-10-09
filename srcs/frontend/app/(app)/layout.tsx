"use client";

import {
	SettingsIcon,
	LogOutIcon,
	Menu
} from "lucide-react"

import { Button } from "@/components/ui/Button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/Dropdown-menu"

export default function AppLayout({ children }: {children: React.ReactNode}) {
	return (
		<section className="app-wrapper overflow-y-hidden">
			<header className="w-auto min-h-15 ml-5 mr-5 mt-3 border border-amber-100 rounded-2xl flex flex-row justify-between items-center">
				<article className="flex flex-row ml-5 items-center">
					<div className="w-10.5 h-10.5 border border-amber-500"></div>
					<h1 className="ml-2 font-mono font-bold text-white">Silk Space</h1>
				</article>
				<article className="mr-5">
					<DropdownMenu>
						<DropdownMenuTrigger render={<Button variant="outline"><Menu /></Button>} />
						<DropdownMenuContent>
							<DropdownMenuItem>
								<SettingsIcon />
								Settings
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem variant="destructive">
								<LogOutIcon />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</article>
			</header>
			{children}
		</section>
	);
}
