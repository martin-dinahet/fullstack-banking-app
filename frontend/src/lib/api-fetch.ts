let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const fetchClient = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(input, {
    ...init,
    credentials: "include",
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    const body = text ? JSON.parse(text) : null;
    throw new Error(body?.message ?? body?.error ?? "Something went wrong. Please try again.");
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
};
