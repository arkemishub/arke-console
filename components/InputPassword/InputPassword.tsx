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
