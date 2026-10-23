export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex flex-col min-h-screen content-center items-center p-3 pl-12 pr-12 text-wrap">
        {children}
      </main>
    </>
		
	);
}