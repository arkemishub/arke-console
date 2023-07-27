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

import { ReactNode } from "react";
import { FormConfigProvider as FCProvider } from "@arkejs/form";
import { Autocomplete, Checkbox, Input, Json } from "@arkejs/ui";
import AutocompleteLink, {
  LinkRef,
} from "@/components/AppFormConfigProvider/components/AutocompleteLink";

export default function AppFormConfigProvider(props: { children: ReactNode }) {
  return (
    <FCProvider
      components={{
        dict: ({ field }) => {
          return (
            <Json
              label={field.label}
              value={JSON.stringify(field.value)}
              onChange={(value) => field.onChange(JSON.parse(value))}
            />
          );
        },
        integer: ({ field }) => (
          <Input
            {...field}
            type="number"
            fullWidth
            onChange={(e) => field.onChange(e.target.value)}
          />
        ),
        float: ({ field }) => (
          <Input
            {...field}
            type="number"
            step="0.01"
            fullWidth
            onChange={(e) => field.onChange(e.target.value)}
          />
        ),
        date: ({ field }) => (
          <Input
            {...field}
            type="date"
            fullWidth
            onChange={(e) => field.onChange(e.target.value)}
          />
        ),
        string: ({ field }) => {
          if (field.values && field.values.length > 0)
            return (
              <Autocomplete
                {...field}
                onChange={(value) => field.onChange(value.value)}
                renderValue={(value) => value.label}
                value={field.values.filter(
                  (item: { value: string }) => item.value === field.value
                )}
              />
            );
          return (
            <Input
              {...field}
              type="text"
              fullWidth
              onChange={(e) => field.onChange(e.target.value)}
            />
          );
        },
        boolean: ({ field }) => (
          <Checkbox
            {...field}
            checked={field.value}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        ),
        list: ({ field }) => (
          <Json
            label={field.label}
            value={JSON.stringify(field.value)}
            onChange={(value) => field.onChange(JSON.parse(value))}
          />
        ),
        link: ({ field }) => (
          <AutocompleteLink {...field} onChange={field.onChange} />
        ),
        default: () => <></>,
      }}
    >
      {props.children}
    </FCProvider>
  );
}
