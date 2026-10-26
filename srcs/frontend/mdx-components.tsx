import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		a: ({href = "", children, ...props}) => {
			const isInternal = href.startsWith("/") || href.startsWith("#");
			if (isInternal) {
				return (
					<Link href={href} {...props}>
						{children}
					</Link>
				);
			}
			return (
				<a href={href} target="_blank" rel="noopener noreferrer" {...props}>
					{children}
				</a>
			);
		},
		...components,
	};
}
