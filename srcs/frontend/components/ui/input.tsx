import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	hasError?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ hasError, className="", ...props }, ref) => (
		<input
			ref={ref}
			aria-invalid={hasError || undefined}
			className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 ${
				hasError ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
				} ${className}`}
				{...props}
		/>
	)
);
Input.displayName = "Input";
