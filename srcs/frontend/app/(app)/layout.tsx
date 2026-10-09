"use client";

export default function AppLayout({ children }: {children: React.ReactNode}) {
	return (
		<section className="app-wrapper min-h-screen overflow-y-hidden">
			{children}
		</section>
	);
}
