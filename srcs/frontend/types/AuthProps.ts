import { ReactNode } from "react";

export type AuthProps = {
	title: string;
	description: string;
	alert?: ReactNode;
	onSubmit: React.SubmitEventHandler<HTMLFormElement>;
	pending: boolean;
	submitLabel: string;
	pendingLabel: string;
	with42Label: string;
	switchLink: ReactNode;
	children: ReactNode;
};
