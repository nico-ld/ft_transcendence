export default function AppLayout({ children }: {children: React.ReactNode}) {
	return (
		<section className="app-wrapper">
			{children}
		</section>
	);
}
