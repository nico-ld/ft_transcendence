import type { ReactNode } from "react";
import Link from "next/link";
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

const link = "underline underline-offset-[0.15em]";

// Styles for the plain HTML written inside intros, section bodies and the page footer
// (p, ul, li, h3, a, code), replacing the old `.page p`, `.page ul`... descendant rules.
const prose = [
  "[&_p]:mb-4",
  "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_li]:mb-[0.4rem]",
  "[&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:text-[1.05rem] [&_h3]:font-semibold",
  "[&_a]:underline [&_a]:underline-offset-[0.15em]",
  "[&_code]:rounded-[4px] [&_code]:bg-current/8 [&_code]:px-[0.35em] [&_code]:py-[0.1em] [&_code]:text-[0.92em]",
].join(" ");

/** Shared layout for /privacy and /terms: title, date, student-project notice, contents, sections. */
export function LegalPage({ title, intro, sections, related }: Props) {
  return (
    <article className="mx-auto w-full max-w-[46rem] px-4 pt-12 pb-16 text-base leading-[1.65] wrap-break-word">
      <header>
        <h1 className="mb-2 text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.2] font-bold">{title}</h1>
        <p className="mb-8 text-[0.9rem] opacity-70">Last updated: {legalInfo.lastUpdated}</p>
      </header>

      <aside
        className="mb-8 rounded-r-[8px] border-l-[3px] border-current bg-current/6 px-5 py-4 [&_p]:m-0"
        aria-label="About this project"
      >
        <p>
          <strong>{legalInfo.projectName} is a student project.</strong> It was built by {teamList},
          students at {legalInfo.school} (France), as part of the 42 curriculum. It is not a commercial
          product, has no customers and is free. It runs only on the team’s machines and on school
          computers, for development and peer evaluation.{" "}
          <strong>Please use test data: don’t enter real personal or confidential information.</strong>
        </p>
      </aside>

      <div className={`text-[1.05rem] ${prose}`}>{intro}</div>

      <nav className="mt-8 rounded-[8px] border border-current/15 px-5 py-4" aria-label="Contents">
        <h2 className="mb-2 text-[0.85rem] leading-[1.3] font-semibold tracking-[0.06em] uppercase opacity-70">
          Contents
        </h2>
        <ol className="m-0 list-decimal gap-x-8 pl-6 [columns:2_16rem]">
          {sections.map((s) => (
            <li key={s.id} className="mb-1 break-inside-avoid">
              <a href={`#${s.id}`} className={link}>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map((s, i) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className={prose}>
          <h2
            id={`${s.id}-title`}
            className="mt-11 mb-3 scroll-mt-20 text-xl leading-[1.3] font-semibold"
          >
            <span className="tabular-nums opacity-50">{i + 1}.</span> {s.title}
          </h2>
          {s.body}
        </section>
      ))}

      <footer className={`mt-12 border-t border-current/15 pt-6 opacity-85 ${prose}`}>
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
  return (
    <div
      className={[
        "mb-5 overflow-x-auto",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:text-[0.95rem] max-[30rem]:[&_table]:text-[0.875rem]",
        "[&_td:first-child]:w-[38%]",
        "[&_:is(th,td)]:border-b [&_:is(th,td)]:border-current/15 [&_:is(th,td)]:py-[0.6rem] [&_:is(th,td)]:pr-3 [&_:is(th,td)]:pl-0 [&_:is(th,td)]:text-left [&_:is(th,td)]:align-top",
        "[&_th]:font-semibold",
      ].join(" ")}
    >
      {children}
    </div>
  );
}