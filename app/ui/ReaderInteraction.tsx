import { IconType } from "react-icons";
import { ReactElement } from "react";

export default function ReaderInteraction({
  icon,
  interactionCount,
  title,
}: {
  icon: ReactElement<IconType>;
  interactionCount: number | undefined;
  title?: string;
}) {
  return (
    <div
      title={title}
      className="flex items-center space-x-1 lg:flex-col lg:justify-center lg:space-x-0 lg:space-y-1"
    >
      <span className="opaity-80 text-2xl">{icon}</span>
      <span className="text-sm lg:text-base">{interactionCount}</span>
    </div>
  );
}
