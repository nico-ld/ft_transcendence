export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
	<main className="app-wrapper min-h-screen">
		{children}
	</main>
	</>
	);
}
