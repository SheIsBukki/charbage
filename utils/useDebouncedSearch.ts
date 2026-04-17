import { useDebouncedCallback } from "use-debounce";
import { Dispatch, SetStateAction, useCallback } from "react";

export const useDebouncedSearch = (delay = 400) => {
  return useCallback(
    useDebouncedCallback(
      async (
        term: string,
        dbAction,
        stateSetter: Dispatch<SetStateAction<any>>,
      ) => {
        const searchedData = await dbAction(term);
        if (searchedData) {
          stateSetter(searchedData);
        }
      },
      delay,
    ),
    [delay],
  );
};

// export const useDebouncedSearch = (delay = 400) => {
//   return useCallback(
//     useDebouncedCallback(async (term, dbAction) => {
//       return await dbAction(term);
//     }, delay),
//     [delay],
//   );
// };
