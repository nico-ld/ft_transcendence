import { redirect } from "next/navigation";
import { getDocNav } from "@/lib/docs";

export default function DocsIndexPage() {
	const first = getDocNav().find((s) => s.items.length > 0)?.items[0];
	redirect(first ? first.href : "/");
}
