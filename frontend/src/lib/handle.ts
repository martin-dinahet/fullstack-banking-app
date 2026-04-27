import type { Result } from "./types/result";

export async function handle<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return { data: null, error };
  }
}
