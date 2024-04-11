/*
 * Copyright 2024 Arkemis S.r.l.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Autocomplete } from "@arkejs/ui";
import { TUnit } from "@arkejs/client";
import React, { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import useClient from "@/arke/useClient";

export default function UnitSearch({
  arke,
  value,
  onChange,
  placeholder,
  label,
  config,
  renderValue,
  renderOption,
}: {
  arke: string;
  value: TUnit;
  onChange: (value: TUnit) => void;
  label?: string;
  placeholder?: string;
  config?(searchedText: string): any;
  renderValue?(val: TUnit): any;
  renderOption?(val: TUnit): any;
}) {
  const client = useClient();
  const [inputValue, setInputValue] = useState("");
  const [values, setValues] = useState<TUnit[]>([]);
  const debouncedInputValue = useDebounce<string>(inputValue, 500);

  useEffect(() => {
    if (debouncedInputValue) {
      client.unit.getAll(arke, config?.(debouncedInputValue)).then((res) => {
        setValues(res.data.content.items);
      });
    }
  }, [debouncedInputValue]);

  return (
    <Autocomplete
      label={label}
      onChange={onChange}
      onInputChange={(event) => setInputValue(event.target.value)}
      values={values}
      value={value}
      renderChips={false}
      placeholder={placeholder || "Search an unit"}
      renderValue={(value) =>
        renderValue?.(value) ?? (value as TUnit).label ?? (value as TUnit).id
      }
      renderOption={renderOption}
    />
  );
}
