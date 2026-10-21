export default function AppLayout({ children }: {children: React.ReactNode}) {
	return (
		<section className="app-wrapper min-h-screen">
			{children}
		</section>
	);
}
