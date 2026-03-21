import { useEffect } from "react";
import { redirect } from "next/navigation";
import { validateRedirect } from "@/utils/helpers";

export function useRedirect({
  userAlreadyLoggedIn,
  state,
}: {
  userAlreadyLoggedIn: boolean;
  state: { message?: string; successful?: boolean } | undefined;
}) {
  useEffect(() => {
    if (userAlreadyLoggedIn) {
      redirect("/");
    }
  }, []);

  // const { previous } = usePreviousPath();

  useEffect(() => {
    if (state?.successful) {
      const previous = sessionStorage.getItem("prevPath") || "/";
      if (validateRedirect(previous)) {
        redirect(previous || "/");
      }
    }
  }, [state?.successful]);
}
