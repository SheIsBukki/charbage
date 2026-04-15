import { useEffect } from "react";

export function useDisableScroll(dialogueState: boolean): void {
  useEffect(() => {
    const html = document.getElementsByTagName("html")[0];

    if (dialogueState && document.body.clientWidth < 768) {
      html.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      html.style.overflow = "visible";
      document.body.style.overflow = "visible";
    }
  }, [dialogueState]);
}
