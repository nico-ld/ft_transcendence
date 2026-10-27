import { startTransition } from "react";

export function useFormSubmit(formAction: (payload: FormData) => void) {
	return function submit (event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		startTransition(() => formAction(form));
	};
}
