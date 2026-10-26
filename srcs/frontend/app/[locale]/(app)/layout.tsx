export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
	<main className="app-wrapper flex flex-1 flex-col">
		{children}
	</main>
	</>
	);
}
