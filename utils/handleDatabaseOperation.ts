export default async function handleDatabaseOperation<T>(
  operation: () => Promise<T>,
  errorMessage = "Database operation failed",
): Promise<{ data: T | null; error: string | null }> {
  try {
    const result = await operation();

    return { data: result, error: null };
  } catch (error) {
    console.error("Database operation failed:", error);
    return { data: null, error: errorMessage };
  }
}
