import { useEffect } from "react";

export function useDisableScroll(dialogueState: boolean): void {
  useEffect(() => {
    if (dialogueState && document.body.clientWidth < 768) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "visible";
    }
  }, [dialogueState]);
}
