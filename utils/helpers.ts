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
  return new Date(dateValue).toLocaleDateString("en-ng", {
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

export const copyCurrentUrl = async () => {
  if (navigator.clipboard && window.isSecureContext) {
    return await navigator.clipboard.writeText(window.location.href);
  }
};

// export const copyCurrentUrl = async () =>
//   await navigator.clipboard.writeText(window.location.href);

// export const copyCurrentUrl = async () => {
//   if (navigator.clipboard && window.isSecureContext) {
//     return await navigator.clipboard.writeText(window.location.href);
//   } else {
//     const fallbackCopyCurrentUrl = () => {
//       const textarea = document.createElement("textarea");
//       textarea.value = window.location.href;
//       document.body.appendChild(textarea);
//       textarea.select();
//
//       try {
//         console.log(document.execCommand("copy"));
//       } catch (e) {
//         console.error(e);
//       } finally {
//         document.body.removeChild(textarea);
//       }
//     };
//   }
// };

export function validateRedirect(redirectUrl: string) {
  return redirectUrl.startsWith("/") && !redirectUrl.startsWith("//");
}

export function setPreviousPath(pathname: string) {
  const current = sessionStorage.getItem("currentPath");

  if (current !== pathname) {
    sessionStorage.setItem("prevPath", current || "/");
    sessionStorage.setItem("currentPath", pathname);
  }

  return {
    current: pathname,
    previous:
      typeof window !== "undefined" ? sessionStorage.getItem("prevPath") : null,
  };
}
