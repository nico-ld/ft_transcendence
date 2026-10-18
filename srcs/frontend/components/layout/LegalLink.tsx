import Link from "next/link";

export function LegalLink() {
	return (
		<div className="text-center text-sm text-muted-foreground">
			<Link href="/privacy" className="hover:underline">Privacy Policy</Link>
			<span aria-hidden="true"> - </span>
			<Link href="/terms" className="hover:underline">Terms of Service</Link>
		</div>
	);
}
