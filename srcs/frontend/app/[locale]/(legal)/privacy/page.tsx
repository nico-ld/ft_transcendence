import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal/LegalPage";
import { getLegalDoc } from "@/lib/legal";
import { languageAlternates } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { frontmatter } = await getLegalDoc(await getLocale(), "privacy");
  return { title: frontmatter.title, description: frontmatter.description, alternates: await languageAlternates("/privacy") };
}

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  const [{ Content, frontmatter, toc }, t] = await Promise.all([getLegalDoc(locale, "privacy"), getTranslations("Legal")]);

  return (
    <LegalPage title={frontmatter.title} toc={toc} related={{ href: "/terms", label: t("terms") }}>
      <Content />
    </LegalPage>
  );
}
