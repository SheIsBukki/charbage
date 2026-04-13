import { Dispatch, SetStateAction } from "react";
import { CiMenuFries } from "react-icons/ci";
import { IoLibraryOutline } from "react-icons/io5";
import { GrRadialSelected } from "react-icons/gr";
import { MdOutlineTopic } from "react-icons/md";

export default function SmViewportPanel({
  smBottomPanel,
  setSmBottomPanel,
}: {
  smBottomPanel: string;
  setSmBottomPanel: Dispatch<SetStateAction<string>>;
}) {
  const bottomPanelItems = [
    { text: "Menu", icon: <CiMenuFries className="text-2xl" /> },
    { text: "Library", icon: <IoLibraryOutline className="text-2xl" /> },
    { text: "Featured", icon: <GrRadialSelected className="text-2xl" /> },
    { text: "Topics", icon: <MdOutlineTopic className="text-2xl" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex w-full items-center justify-center space-x-8 border-t-2 bg-gray-50 py-4 text-gray-600 md:hidden dark:bg-gray-950 dark:text-gray-300">
      {bottomPanelItems.map(({ icon, text }) => (
        <button
          onClick={() => {
            if (smBottomPanel === text) {
              setSmBottomPanel("");
            } else {
              setSmBottomPanel(text);
            }
          }}
          key={text}
          className="flex flex-col items-center space-y-1"
        >
          {icon}
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {text}
          </span>
        </button>
      ))}
    </div>
  );
}
