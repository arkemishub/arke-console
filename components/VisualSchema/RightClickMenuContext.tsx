import { ReactNode, useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";

interface RightClickMenuContextProps {
  children: ReactNode;
  onCreateArke(): void;
}

export default function RightClickMenuContext(
  props: RightClickMenuContextProps
) {
  const { onCreateArke } = props;
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const rightClickMenuRef = useRef<HTMLDivElement>(null);
  const clickOutsideHandler = () => {
    setShowContextMenu(false);
  };
  useOnClickOutside(rightClickMenuRef, clickOutsideHandler);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  return (
    <span
      className="relative bg-red-100"
      onContextMenu={(e) => {
        e.preventDefault(); // prevent the default behaviour when right-clicked
        setPosition({
          left: e.nativeEvent.offsetX,
          top: e.nativeEvent.offsetY,
        });
        setShowContextMenu(true);
      }}
    >
      {props.children}

      {showContextMenu && (
        <div
          ref={rightClickMenuRef}
          className="card text-md absolute px-4"
          style={{ top: position.top, left: position?.left }}
        >
          <div
            className="cursor-pointer"
            onClick={() => {
              setShowContextMenu(false);
              onCreateArke();
            }}
          >
            Create an Arke
          </div>
        </div>
      )}
    </span>
  );
}
