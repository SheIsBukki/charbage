import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { GrAlert } from "react-icons/gr";

export default function VerifyAccountDelete({
  usernameInput,
  setUsernameInput,
  deleteMyAccountInput,
  setDeleteMyAccountInput,
}: {
  usernameInput: string;
  setUsernameInput: Dispatch<SetStateAction<string>>;
  deleteMyAccountInput: string;
  setDeleteMyAccountInput: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="space-y-4">
      <p
        aria-hidden={true}
        className="flex items-center space-x-2 border border-red-500 bg-red-100 p-2 dark:bg-red-950"
      >
        <GrAlert className="text-xl text-red-500" />
        <span className="text-sm">This is extremely important</span>
      </p>

      <p
        aria-hidden={true}
        className="block text-sm text-gray-600 dark:text-gray-400"
      >
        We will immediately delete this account along with all your posts,
        comments, bookmarks, and likes. Deleting your account is permanent and
        will free up your username.
      </p>

      <form action="" className="w-full space-y-4">
        <div className="space-y-1">
          <label htmlFor="usernameOrEmail" className="">
            Enter your username or email address:
          </label>
          <Input
            value={usernameInput}
            onChange={(e) => {
              setUsernameInput(e.target.value);
            }}
            id="usernameOrEmail"
            type="text"
            className="rounded-lg border py-2"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="deleteMyAccountStr" className="">
            To verify, type:{" "}
            <span className="font-mono text-sm font-thin">
              delete my account
            </span>
          </label>
          <Input
            value={deleteMyAccountInput}
            onChange={(e) => setDeleteMyAccountInput(e.target.value)}
            id="deleteMyAccountStr"
            type="text"
            className="rounde"
          />
        </div>
      </form>
    </div>
  );
}
