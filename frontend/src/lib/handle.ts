import type { Result } from "./types/result";

export async function handle<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (err) {
    if (err instanceof Error) {
      const message = err.message;
      if (message.startsWith("HTTP error!")) {
        const status = message.match(/status: (\d+)/)?.[1];
        if (status === "401") return { data: null, error: "Invalid credentials" };
        if (status === "409") return { data: null, error: "Email already in use" };
        if (status === "400") return { data: null, error: "Bad request" };
      }
      return { data: null, error: message };
    }
    return { data: null, error: "An error occurred" };
  }
}
