export const fetchClient = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    const body = text ? JSON.parse(text) : null;
    throw new Error(body?.message ?? body?.error ?? "Something went wrong. Please try again.");
  }
  if (res.status === 204) return null as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
};
