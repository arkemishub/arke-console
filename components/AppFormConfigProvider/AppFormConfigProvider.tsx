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
import { FormConfigProvider as FCProvider, RenderProps } from "@arkejs/form";
import { Autocomplete, Checkbox, Input, Json } from "@arkejs/ui";
import AutocompleteLink, {
  LinkRef,
} from "@/components/AppFormConfigProvider/components/AutocompleteLink";

export default function AppFormConfigProvider(props: { children: ReactNode }) {
  return (
    <FCProvider
      components={{
        dict: (props) => {
          return (
            <Json
              label={props.label}
              value={JSON.stringify(props.value)}
              onChange={(value) => props.onChange(JSON.parse(value))}
            />
          );
        },
        integer: (props) => (
          <Input
            {...props}
            type="number"
            fullWidth
            onChange={(e) => props.onChange(e.target.value)}
          />
        ),
        float: (props) => (
          <Input
            {...props}
            type="number"
            step="0.01"
            fullWidth
            onChange={(e) => props.onChange(e.target.value)}
          />
        ),
        date: (props) => (
          <Input
            {...props}
            type="date"
            fullWidth
            onChange={(e) => props.onChange(e.target.value)}
          />
        ),
        string: (props) => {
          if (props.values && props.values.length > 0)
            return (
              <Autocomplete
                {...props}
                onChange={(value) => props.onChange(value.value)}
                renderValue={(value) => value.label}
                value={props.values.filter(
                  (item: { value: string }) => item.value === props.value
                )}
              />
            );
          return (
            <Input
              {...props}
              type="text"
              fullWidth
              onChange={(e) => props.onChange(e.target.value)}
            />
          );
        },
        boolean: (props) => (
          <Checkbox
            {...props}
            checked={props.value}
            onChange={(e) => props.onChange(e.target.checked)}
          />
        ),
        list: (props) => (
          <Json
            label={props.label}
            value={JSON.stringify(props.value)}
            onChange={(value) => props.onChange(JSON.parse(value))}
          />
        ),
        link: (props: RenderProps & { ref: LinkRef }) => (
          <AutocompleteLink
            {...props}
            reference={props.ref}
            onChange={props.onChange}
          />
        ),
        default: (props: RenderProps & { type: string }) => <></>,
      }}
    >
      {props.children}
    </FCProvider>
  );
}
