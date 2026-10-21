import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		agentFeedback: true,
	},
	cacheComponents: true,
	partialPrefetching: true,
	turbopack: {
		rules: {
			"*.css": {
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
			},
		},
	},
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"]
};

const withMDX = createMDX({
	options: {
		remarkPlugins: [
			"remark-gfm",
			"remark-frontmatter",
			["remark-mdx-frontmatter", {name: "frontmatter"}]
		],
		rehypePlugins: ["rehype-slug"]
	}
});

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(withMDX(nextConfig));
