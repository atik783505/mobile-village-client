import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

async function getUserId(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

export const serverFetch = async (path: string) => {
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }

  const userId = await getUserId();

  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(userId && { "x-user-id": userId }),
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`);
  }

  return res.json();
};

export const serverMutation = async (
  path: string,
  data?: object,
  method = "POST"
) => {
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }

  const userId = await getUserId();

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(userId && { "x-user-id": userId }),
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Mutation failed: ${res.status}`);
  }

  return res.json();
};
