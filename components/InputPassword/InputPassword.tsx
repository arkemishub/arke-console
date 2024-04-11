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

import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@arkejs/ui";
import React, { useState } from "react";

interface InputPasswordProps {
  value: string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

export default function InputPassword(props: InputPasswordProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { value, onChange } = props;
  return (
    <Input
      autoComplete="new-password"
      value={value}
      type={!showPassword ? "password" : "text"}
      onChange={onChange}
      placeholder="Password"
      fullWidth
      startAdornment={<LockClosedIcon className="h-5 w-5 stroke-white/50" />}
      endAdornment={
        <span
          role="presentation"
          onClick={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? (
            <EyeIcon className="h-5 w-5 stroke-white/50" />
          ) : (
            <EyeSlashIcon className="h-5 w-5 stroke-white/50" />
          )}
        </span>
      }
    />
  );
}
