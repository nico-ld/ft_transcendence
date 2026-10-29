import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AuthError({title, message}: {title: string; message: string}) {
	return (
		<Alert variant="destructive" className="bg-muted/50">
			<TriangleAlert />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	);
}
