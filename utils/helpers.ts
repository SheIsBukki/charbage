import md from "@/utils/md";

export async function handleDatabaseOperation<T>(
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

export const regularDate = (dateValue: string | number | Date) => {
  return new Date(dateValue).toLocaleDateString("en-uk", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  });
};

export const createExcerpt = (content: string) => {
  const htmlContent = md.render(content);

  const excerpt = htmlContent
    .replace(/<img[^>]*>/g, "")
    .replace(/<h[1-6]>/g, "<p>")
    .replace(/<\/h[1-6]>/g, "</p>")
    .replace(/<blockquote>/g, "<p>")
    .replace(/<\/blockquote>/g, "</p>")
    .substring(0, 160);

  return (
    excerpt.replace(/<[^>]*$/, "") + (htmlContent.length > 160 ? "..." : "")
  );
};
