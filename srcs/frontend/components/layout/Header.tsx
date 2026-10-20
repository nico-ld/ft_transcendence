"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {ChevronDown, LogOut, Moon, Settings, Sun, Sword} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { AdminBadge } from "./CustomBadge";
import { SilkSpaceLogo } from "../ui/logo";
import { HeaderProps } from "@/types/HeaderProps";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Logout } from "@/app/actions/auth";


export function Header({ role, username, avatarUrl }: HeaderProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const [isPending, startTransition] = useTransition();

	const isDark = resolvedTheme === "dark";
	const home = role === "admin" ? "/admin" : "/dashboard";

	return (
		<header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-6">
			{/* Left: logo */}
			<SilkSpaceLogo>{role === "admin" && (<AdminBadge />)}</SilkSpaceLogo>

			{/* Right:user menu */}
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button 
							variant="ghost"
							className="h-10 gap-2 px-1.5"
							aria-label="Open user menu"
						/>
					}
				>
					<Avatar>
						{avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
						<AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
					</Avatar>
					<span className="hidden text-sm sm:inline">{username}</span>
					<ChevronDown className="size-4 text-muted-foreground" />
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuGroup>
						<DropdownMenuLabel>
							<span className="block text-sm font-medium text-foreground">{username}</span>
							<span className="block capitalize">{role}</span>
						</DropdownMenuLabel>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuItem render={<Link href={`${home}/settings`} />}>
						<Settings />
						Settings
					</DropdownMenuItem>

					<DropdownMenuItem
						closeOnClick={false}
						onClick={() => setTheme(isDark ? "light" : "dark")}
					>
						{isDark ? <Sun /> : <Moon />}
						{isDark ? "Light mode" : "Dark mode"}
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						variant="destructive"
						disabled={isPending}
						onClick={() => startTransition(() => Logout())}
					>
						<LogOut />
						{isPending ? "Logging out" : "Log out"}
						{isPending && <Spinner />}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	)
}
