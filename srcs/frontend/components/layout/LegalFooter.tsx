import Link from "next/link";
import { legalInfo } from "@/components/legal/LegalInfo";

export default function LegalFooter() {
  return (
    <footer className="py-4 text-center text-sm text-muted-foreground">
      <nav aria-label="Legal" className="space-x-2">
        <Link href="/legal/privacy" className="hover:underline">Privacy Policy</Link>
        <Link href="/legal/terms" className="hover:underline">Terms of Service</Link>
      </nav>
      <span>
        {legalInfo.projectName}, a student project at {legalInfo.school}
      </span>
    </footer>
  );
}
