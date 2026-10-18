import Link from "next/link";
import styles from "./legal.module.css";
import { legalInfo } from "./LegalInfo";

/**
 * Footer with the links the subject requires. Render it once in app/layout.tsx, after {children},
 * so it appears on every page (login page included).
 */
export default function LegalFooter() {
  return (
    <footer className={styles.siteFooter}>
      <nav aria-label="Legal">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
      </nav>
      <span>
        {legalInfo.projectName}, a student project at {legalInfo.school}
      </span>
    </footer>
  );
}
