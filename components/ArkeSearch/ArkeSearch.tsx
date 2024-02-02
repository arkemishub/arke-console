import { Autocomplete } from "@arkejs/ui";
import { TUnit } from "@arkejs/client";
import React, { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import useClient from "@/arke/useClient";

export default function ArkeSearch({
  value,
  onChange,
}: {
  value: TUnit;
  onChange: (value: TUnit) => void;
}) {
  const client = useClient();
  const [inputValue, setInputValue] = useState("");
  const [values, setValues] = useState<TUnit[]>([]);
  const debouncedInputValue = useDebounce<string>(inputValue, 500);

  useEffect(() => {
    if (debouncedInputValue) {
      client.arke
        .getAll({
          params: {
            offset: 0,
            limit: 5,
            filter: `and(contains(id,${debouncedInputValue}))`,
            order: `label;asc`,
          },
        })
        .then((res) => {
          setValues(res.data.content.items);
        });
    }
  }, [debouncedInputValue]);

  return (
    <Autocomplete
      onChange={onChange}
      onInputChange={(event) => setInputValue(event.target.value)}
      values={values}
      value={value}
      renderChips={false}
      placeholder="Search an Arke or Group"
      renderValue={(value) => (value as TUnit).label ?? (value as TUnit).id}
    />
  );
}
