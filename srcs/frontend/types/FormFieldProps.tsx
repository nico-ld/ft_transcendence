export type FormFieldProps = React.ComponentProps<"input"> & {
	label: string;
	error?: string;
}