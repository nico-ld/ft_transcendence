import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./legal.module.css";
import { legalInfo, teamList } from "./LegalInfo";

export type LegalSection = {
  id: string;
  title: string;
  body: ReactNode;
};

type Props = {
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
  /** Link to the other legal page, shown at the bottom. */
  related: { href: string; label: string };
};

/** Shared layout for /privacy and /terms: title, date, student-project notice, contents, sections. */
export function LegalPage({ title, intro, sections, related }: Props) {
  return (
    <article className={styles.page}>
      <header>
        <h1>{title}</h1>
        <p className={styles.meta}>Last updated: {legalInfo.lastUpdated}</p>
      </header>

      <aside className={styles.notice} aria-label="About this project">
        <p>
          <strong>{legalInfo.projectName} is a student project.</strong> It was built by {teamList},
          students at {legalInfo.school} (France), as part of the 42 curriculum. It is not a commercial
          product, has no customers and is free. It runs only on the team’s machines and on school
          computers, for development and peer evaluation.{" "}
          <strong>Please use test data: don’t enter real personal or confidential information.</strong>
        </p>
      </aside>

      <div className={styles.intro}>{intro}</div>

      <nav className={styles.toc} aria-label="Contents">
        <h2>Contents</h2>
        <ol>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>{s.title}</a>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map((s, i) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`}>
          <h2 id={`${s.id}-title`}>
            <span className={styles.num}>{i + 1}.</span> {s.title}
          </h2>
          {s.body}
        </section>
      ))}

      <footer className={styles.pageFooter}>
        <p>
          See also: <Link href={related.href}>{related.label}</Link>
        </p>
      </footer>
    </article>
  );
}

export function ContactEmail() {
  return <a href={`mailto:${legalInfo.contactEmail}`}>{legalInfo.contactEmail}</a>;
}

/** Wraps a table so it scrolls sideways on narrow screens instead of breaking the layout. */
export function TableWrap({ children }: { children: ReactNode }) {
  return <div className={styles.tableWrap}>{children}</div>;
}
