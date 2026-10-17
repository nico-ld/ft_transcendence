const APP_NAME="Silk Space"

export function SilkSpaceLogo({children}: {children?: React.ReactNode}) {
	return (
		<div className="flex items-center gap-2 font-semibold">
			<span className="size-7 rounded-lg bg-primary" aria-hidden />
			{APP_NAME}
			{children}
		</div>
	);
}