"use client";

import { useTransition } from "react";
import { useTheme } from "next-themes";
import {ChevronDown, LogOut, Moon, UserRoundPen, Sun} from "lucide-react";
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
import { Logout } from "@/actions/auth";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROLE_HOME } from "@/lib/utils";
import { Role } from "@/types/User";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitch } from "./ThemeSwicth";


export function Header({ role, username, avatarUrl }: HeaderProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const [isPending, startTransition] = useTransition();

	const isDark = resolvedTheme === "dark";
	const home = ROLE_HOME[role];
	
	const locale = useLocale();
	const t = useTranslations("Header");

	return (
		<header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-6">
			{/* Left: logo, back to the dashboard */}
			<Link href={home} className="rounded-lg">
				<SilkSpaceLogo>{role === Role.ADMIN && (<AdminBadge />)}</SilkSpaceLogo>
			</Link>

			{/* Right:user menu */}
			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button 
							variant="ghost"
							className="h-10 gap-2 px-1.5"
							aria-label={t("userMenu")}
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
							<span className="block capitalize">{t(role)}</span>
						</DropdownMenuLabel>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuItem render={<Link href="/profile" />}>
						<UserRoundPen />
						{t("editProfile")}
					</DropdownMenuItem>

					<LanguageSwitcher variant="submenu" />

					<ThemeSwitch variant="submenu" />

					<DropdownMenuSeparator />

					<DropdownMenuItem
						variant="destructive"
						disabled={isPending}
						onClick={() => startTransition(() => Logout(locale))}
					>
						<LogOut />
						{isPending ? t("loggingOut") : t("logout")}
						{isPending && <Spinner />}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	)
}
