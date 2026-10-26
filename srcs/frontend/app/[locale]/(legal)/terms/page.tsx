import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalInfo } from "@/components/legal/LegalInfo";
import { getLegalDoc } from "@/lib/legal";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getLegalDoc(await getLocale(), "terms");
  return { title: `${frontmatter.title} · ${legalInfo.projectName}`, description: frontmatter.description };
}

export default async function TermsOfServicePage() {
  const locale = await getLocale();
  const [{ Content, frontmatter, toc }, t] = await Promise.all([getLegalDoc(locale, "terms"), getTranslations("Legal")]);

  return (
    <LegalPage title={frontmatter.title} toc={toc} related={{ href: "/privacy", label: t("privacy") }}>
      <Content />
    </LegalPage>
  );
}
