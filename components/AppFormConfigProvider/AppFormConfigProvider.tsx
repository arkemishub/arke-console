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
                getDisplayValue={(value) => value.label}
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
            onChange={(value) => props.onChange(value.id)}
          />
        ),
        default: (props: RenderProps & { type: string }) => <></>,
      }}
    >
      {props.children}
    </FCProvider>
  );
}
