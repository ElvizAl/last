import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "#/lib/auth/auth";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_API_URL!,
	plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
