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

import { Column, Filter, FilterOperator, Sort, SortType } from "@arkejs/table";
import { Autocomplete, Button, Input } from "@arkejs/ui";
import { twMerge } from "tailwind-merge";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

type InlineFilterProps = {
  column: Column;
  filters: Filter[];
  onFiltersChange?: (filters: Filter[]) => void;
  onSortChange?: (sort: Sort[]) => void;
  sort: Sort[];
  filterable?: boolean;
  sortable?: boolean;
};

function InlineFilter({ filterable = true, ...props }: InlineFilterProps) {
  const onSortChange = () => {
    if (props.sortable) {
      let newSort = props?.sort?.find((s) => s.columnId === props.column.id);

      if (newSort?.type === SortType.DESC) {
        props.onSortChange?.(
          props.sort.filter((s) => s.columnId !== props.column.id)
        );
      } else {
        props.onSortChange?.([
          ...props.sort.filter((s) => s.columnId !== props.column.id),
          {
            columnId: props.column.id,
            type: newSort?.type === SortType.ASC ? SortType.DESC : SortType.ASC,
          },
        ]);
      }
    }
  };

  const currentSort = props?.sort?.find((s) => s.columnId === props.column.id);

  return (
    <>
      <Button
        className={twMerge(
          "flex w-full cursor-default items-center gap-2 rounded-theme-sm p-2 text-left",
          props.sortable && "cursor-pointer hover:bg-background-400"
        )}
        onClick={onSortChange}
      >
        <p className="w-full truncate">{props.column.label}</p>
        <ArrowDownIcon
          className={twMerge(
            currentSort?.type === SortType.DESC && "rotate-180",
            !currentSort && "opacity-0",
            "h-4 w-4 hover:opacity-100"
          )}
        />
      </Button>
      {filterable && (
        <div className="mt-2">
          <InlineFilterInput {...props} />
        </div>
      )}
    </>
  );
}

function InlineFilterInput({ column, filters, ...props }: InlineFilterProps) {
  const onFiltersChange = (newFilters: Partial<Filter>[]) => {
    props.onFiltersChange?.([
      ...(filters.filter(
        (f) => !newFilters.some((filter) => filter.columnId === f.columnId)
      ) as Filter[]),
      ...(newFilters.filter((f) => f?.value) as Filter[]),
    ]);
  };

  if (column.type === "string") {
    return (
      <Input
        value={filters.find((f) => f.columnId === column.id)?.value ?? ""}
        placeholder={`Filter ${column.label}`}
        fullWidth
        onChange={(e) =>
          onFiltersChange([
            {
              columnId: column.id,
              operator: FilterOperator.ICONTAINS,
              value: e.target.value,
            },
          ])
        }
      />
    );
  }

  if (column.type === "boolean") {
    const values = [
      {
        value: "true",
        label: "True",
      },
      {
        value: "false",
        label: "False",
      },
    ];
    const filterValue = filters.find((f) => f.columnId === column.id)?.value;
    return (
      <Autocomplete
        nullable
        clearable
        placeholder={`Filter ${column.label}`}
        value={values.find((v) => v.value === filterValue)}
        onChange={(option) =>
          onFiltersChange([
            {
              columnId: column.id,
              operator: FilterOperator.EQ,
              value: option?.value,
            },
          ])
        }
        getDisplayValue={(value) => value.label}
        values={values}
      />
    );
  }

  return <div className="h-[40px]" />;
}

export default InlineFilter;
