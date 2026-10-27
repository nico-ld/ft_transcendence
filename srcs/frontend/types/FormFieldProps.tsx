export type FormFieldProps = React.ComponentProps<"input"> & {
	label: string;
	error?: string;
}

export type FieldName = "email" | "username" | "password" | "confirmPassword";
