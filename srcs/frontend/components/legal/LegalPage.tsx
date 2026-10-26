import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { TocItem } from "@/types/Doc";
import { legalInfo } from "./LegalInfo";

type Props = {
  title: string;
  toc: TocItem[];
  related: { href: "/privacy" | "/terms"; label: string };
  children: ReactNode;
};

const link = "underline underline-offset-[0.15em]";

// HTML for MDX content and page footer produce
const prose = [
  "[&_p]:mb-4",
  "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_li]:mb-[0.4rem]",
  "[&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:text-[1.05rem] [&_h3]:font-semibold",
  "[&_a]:underline [&_a]:underline-offset-[0.15em]",
  "[&_code]:rounded-[4px] [&_code]:bg-current/8 [&_code]:px-[0.35em] [&_code]:py-[0.1em] [&_code]:text-[0.92em]",
].join(" ");

const sections = [
  "[&>p:first-child]:text-[1.05rem] [counter-reset:section]",
  "[&_h2]:mt-11 [&_h2]:mb-3 [&_h2]:scroll-mt-20 [&_h2]:text-xl [&_h2]:leading-[1.3] [&_h2]:font-semibold",
  "[&_h2]:[counter-increment:section] [&_h2]:before:mr-2 [&_h2]:before:tabular-nums [&_h2]:before:opacity-50 [&_h2]:before:content-[counter(section)'.']",
].join(" ");

// Shared layout for /privacy and /terms
export async function LegalPage({ title, toc, related, children }: Props) {
  const [t, locale] = await Promise.all([getTranslations("Legal"), getLocale()]);
  const team = new Intl.ListFormat(locale).format(legalInfo.team);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(legalInfo.lastUpdated));

  return (
    <article className="mx-auto w-full max-w-[46rem] px-4 pt-12 pb-16 text-base leading-[1.65] wrap-break-word">
      <header>
        <h1 className="mb-2 text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.2] font-bold">{title}</h1>
        <p className="mb-8 text-[0.9rem] opacity-70">{t("lastUpdated", { date })}</p>
      </header>

      <aside
        className="mb-8 rounded-r-[8px] border-l-[3px] border-current bg-current/6 px-5 py-4 [&_p]:m-0"
        aria-label={t("noticeLabel")}
      >
        <p>
          {t.rich("notice", {
            project: legalInfo.projectName,
            team,
            school: legalInfo.school,
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </aside>

      <nav className="mb-8 rounded-[8px] border border-current/15 px-5 py-4" aria-label={t("contents")}>
        <h2 className="mb-2 text-[0.85rem] leading-[1.3] font-semibold tracking-[0.06em] uppercase opacity-70">
          {t("contents")}
        </h2>
        <ol className="m-0 list-decimal gap-x-8 pl-6 [columns:2_16rem]">
          {toc.map((item) => (
            <li key={item.id} className="mb-1 break-inside-avoid">
              <a href={`#${item.id}`} className={link}>
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className={`${prose} ${sections}`}>{children}</div>

      <footer className={`mt-12 border-t border-current/15 pt-6 opacity-85 ${prose}`}>
        <p>
          {t("seeAlso")} <Link href={related.href}>{related.label}</Link> · <Link href="/">{t("home")}</Link>
        </p>
      </footer>
    </article>
  );
}

export function ContactEmail() {
  return <a href={`mailto:${legalInfo.contactEmail}`}>{legalInfo.contactEmail}</a>;
}

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
