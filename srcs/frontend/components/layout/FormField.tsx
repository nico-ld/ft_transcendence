import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import type { FormFieldProps } from "@/types/FormFieldProps";

export function FormField({label, error, ...props}: FormFieldProps) {
	const id = useId();
	const errorId = `${id}-error`;

	return (
		<div className="grid gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				id={id}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				className="bg-card"
				{...props}
			/>
			{error && (
				<p id={errorId} className="text-sm text-destructive">
					{error}
				</p>
			)}
		</div>
	);
}
