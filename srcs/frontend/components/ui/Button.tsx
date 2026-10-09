import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean;
	variant?: "primary" | "secondary";
};

export function Button({
	loading, variant = "primary", children, disabled, className="", ...props
}: ButtonProps) {
	const styles = variant === "primary" ? "bg-blue-600 white hover:bg-blue-700" : "border borer-gray-300 hover:bg-gray-100";
	return (
		<button 
			disabled={disabled || loading}
			className={`rounded-md px-4 py-2 font-medium disabled:opacity-50 ${styles} ${className}`}
			{...props}
		>
			{loading ? "Loading..." : children}
		</button>
	);
}
