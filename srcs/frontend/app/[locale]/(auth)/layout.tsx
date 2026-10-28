export default function authLayout({children}: {children: React.ReactNode}) {
	return (
		<main className="relative flex flex-1 flex-col">
			{children}
		</main>
	);
}
