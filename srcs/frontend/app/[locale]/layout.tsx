import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LegalFooter } from "@/components/legal/LegalFooter";
import { Toaster } from "@/components/ui/toast";
import { SITE_URL } from "@/lib/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// in the page's language (Metadata in messages/*.json). Pages give their own
// title, and the template adds the site's name after it. The pages' relative
// links (canonical, languages) are made absolute from metadataBase
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Metadata");

	return {
		metadataBase: SITE_URL,
		title: { template: `%s · ${t("title")}`, default: t("title") },
		description: t("description")
	};
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({locale}));
}

export default async function RootLayout({ children }: {children: React.ReactNode}) {
	const locale = await getLocale();

	return (
		<html
			lang={locale}
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<body className="min-h-full flex flex-col">
				<NextIntlClientProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						{children}
						<Toaster />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
