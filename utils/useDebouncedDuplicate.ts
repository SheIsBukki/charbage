import { emailAlreadyExists, usernameAlreadyExists } from "@/db/queries/select";
import { useDebouncedCallback } from "use-debounce";
import { Dispatch, SetStateAction, useCallback } from "react";

export const useDebouncedDuplicate = (delay = 400) => {
  return useCallback(
    useDebouncedCallback(
      async (
        stateSetter: Dispatch<SetStateAction<string>>,
        userInput: string,
        // inputName:string
      ) => {
        // if (inputName==="email") {
        //   const doesEmailExist = await emailAlreadyExists(userInput);
        //
        //   if (doesEmailExist.result) {
        //     stateSetter(`Email "${userInput}" already exists`);
        //   } else {
        //     stateSetter("");
        //   }
        // }

        // if (inputName==="username") {
        const existingUsername = await usernameAlreadyExists(userInput);

        if (existingUsername.result) {
          stateSetter(`Username "${userInput}" is taken`);
        } else {
          stateSetter("");
        }
        // }
      },
      delay,
    ),
    [delay],
  );
};
