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
import useClient from "@/arke/useClient";
import { Input } from "@arkejs/ui";
import { useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";

interface PermissionInputProps {
  role: string;
  value: string;
}
export function PermissionInput(props: PermissionInputProps) {
  const client = useClient();
  const [value, setValue] = useState(props.value);
  const inputRef = useRef<HTMLDivElement>(null);

  function onUpdateData() {
    console.log(value);
  }

  useOnClickOutside(inputRef, onUpdateData);
  return (
    <Input
      {...props}
      itemRef={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onUpdateData()}
      onBlur={onUpdateData}
    />
  );
}
