"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Camera } from "lucide-react";
import { updateAvatar } from "@/actions/updateAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

const TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SIZE = 256;

// center-cropped square, small enough for the backend (150 000 characters max, schemas.py)
async function resize(file: File): Promise<string> {
	const bitmap = await createImageBitmap(file);
	const side = Math.min(bitmap.width, bitmap.height);
	const canvas = document.createElement("canvas");
	canvas.width = SIZE;
	canvas.height = SIZE;
	canvas.getContext("2d")?.drawImage(
		bitmap,
		(bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side,
		0, 0, SIZE, SIZE
	);
	const webp = canvas.toDataURL("image/webp", 0.85);
	// Safari can't encode webp and returns a png instead, which can be too big
	return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", 0.85);
}

export function AvatarForm({ avatar, username }: { avatar: string | null; username: string }) {
	const t = useTranslations("Profile.avatar");
	const inputId = React.useId();
	const [error, setError] = React.useState<"type" | "size" | "generic">();
	const [pending, startTransition] = React.useTransition();

	function save(file: File | undefined | null) {
		setError(undefined);
		if (file && !TYPES.includes(file.type))
			return setError("type");
		if (file && file.size > MAX_FILE_SIZE)
			return setError("size");
		startTransition(async () => {
			try {
				const result = await updateAvatar(file ? await resize(file) : null);
				if (!result?.ok)
					throw new Error(result?.error);
				toast.add({ type: "success", title: t(file ? "saved" : "removed") });
			} catch {
				setError("generic");
			}
		});
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-4">
				<label
					htmlFor={inputId}
					onDragOver={(event) => event.preventDefault()}
					onDrop={(event) => {
						event.preventDefault();
						save(event.dataTransfer.files[0]);
					}}
					className="group relative cursor-pointer rounded-full has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
				>
					<Avatar className="size-20">
						{avatar && <AvatarImage src={avatar} alt="" />}
						<AvatarFallback className="text-xl">{username.slice(0, 2).toUpperCase()}</AvatarFallback>
					</Avatar>
					<span className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white transition-opacity ${
						pending ? "opacity-100" : "opacity-0 group-hover:opacity-100"
					}`}>
						{pending ? <Spinner /> : <Camera className="size-5" />}
					</span>
					<input
						id={inputId}
						type="file"
						accept={TYPES.join(",")}
						aria-label={t("change")}
						className="sr-only"
						disabled={pending}
						onChange={(event) => {
							save(event.target.files?.[0]);
							// so choosing the same file again still triggers onChange
							event.target.value = "";
						}}
					/>
				</label>

				<div className="flex flex-col items-start gap-1 text-sm">
					<label htmlFor={inputId} className="cursor-pointer font-medium hover:underline">
						{t("change")}
					</label>
					<span className="text-muted-foreground">{t("hint")}</span>
					{avatar && (
						<Button
							variant="link"
							className="h-auto p-0 text-muted-foreground hover:text-destructive"
							disabled={pending}
							onClick={() => save(null)}
						>
							{t("remove")}
						</Button>
					)}
				</div>
			</div>

			{error && <p role="alert" className="text-sm text-destructive">{t(`errors.${error}`)}</p>}
		</div>
	);
}
