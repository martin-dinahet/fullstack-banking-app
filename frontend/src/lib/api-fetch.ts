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
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return (await res.json()) as T;
};
