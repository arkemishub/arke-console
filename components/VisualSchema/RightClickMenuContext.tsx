/**
 * Copyright 2023 Arkemis S.r.l.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
