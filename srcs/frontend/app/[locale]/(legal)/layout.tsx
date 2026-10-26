export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex flex-1 flex-col content-center items-center p-3 pl-12 pr-12 text-wrap">
        {children}
      </main>
    </>
		
	);
}