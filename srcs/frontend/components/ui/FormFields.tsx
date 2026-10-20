import {useId, type ReactNode } from "react";

type FormFieldProps = {
	label: string;
	error?: string;
	children: (props: { id: string; hasError: boolean }) => ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
	const id = useId();
	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={id} className="ttext-sm font-medium">
				{label}
			</label>
			{children({ id, hasError: !!error })}
			{error && (
				<p role="alert" className="text-sm text-red-600">
					{error}
				</p>
			)}
		</div>
	);
}
