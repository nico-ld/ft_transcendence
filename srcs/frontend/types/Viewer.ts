import { BackendUser } from "@/lib/backend";

export type Viewer = Pick<BackendUser, "id" | "role">;
