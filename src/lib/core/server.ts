
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const serverFetch = async (path: string) => {
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }

  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
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

  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Mutation failed: ${res.status}`);
  }

  return res.json();
};
