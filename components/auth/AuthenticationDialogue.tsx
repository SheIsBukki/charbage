import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GiCabbage } from "react-icons/gi";

export default function AuthenticationDialogue({
  showDialogue,
  setShowAuthenticationDialogue,
}: {
  showDialogue: boolean;
  setShowAuthenticationDialogue: Dispatch<SetStateAction<boolean>>;
}) {
  const triggerRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showDialogue) {
      triggerRef.current?.click();
      setShowAuthenticationDialogue(false);
    }
  }, [showDialogue]);

  return (
    <Dialog>
      <DialogTrigger>
        <input ref={triggerRef} type="hidden" />
      </DialogTrigger>

      <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center space-x-2 md:text-xl">
              <GiCabbage className="size-8 rounded-full border" />
              <span>Log in to continue</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center md:text-base">
          Log in or sign up to enjoy the full experience of Charbage!
        </DialogDescription>
        <Button className="rounded-l bg-indigo-600 text-white hover:bg-indigo-800 md:text-base">
          <Link href="/sign-in">Log in</Link>
        </Button>
        <Button variant="outline" className="rounded-l md:text-base">
          <Link href="/sign-up">Create an account</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
