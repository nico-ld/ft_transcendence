const APP_NAME="ft_silk_space"

export function SilkSpaceLogo({children}: {children?: React.ReactNode}) {
	return (
		<div className="flex items-center gap-2 font-semibold">
			<span className="size-7 rounded-lg bg-linear-to-br from-blue-500 to-purple-600" aria-hidden />
			{APP_NAME}
			{children}
		</div>
	);
}
