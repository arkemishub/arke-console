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

import { AllColumns, Filter, FilterOperator } from "@arkejs/table";
import { Button, Input, Popover, Select } from "@arkejs/ui";
import { FunnelIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useMemo, useState } from "react";

function Filters({
  onFiltersChange,
  allColumns,
  ...props
}: {
  allColumns: AllColumns;
  filters: Filter[];
  onFiltersChange: (filters: Filter[]) => void;
}) {
  const filterableColumns = useMemo(
    () =>
      allColumns.filter(
        (c) =>
          c.availableFilterOperators && c.availableFilterOperators.length > 0
      ),
    []
  );

  const initFilters = useMemo(
    () => ({
      columnId: filterableColumns[0]?.id,
      operator: filterableColumns[0]?.availableFilterOperators?.[0],
      value: "",
    }),
    [filterableColumns]
  );

  const [filters, setFilters] = useState<Partial<Filter>[]>(
    props.filters.length > 0 ? props.filters : [initFilters]
  );

  const onColumnChange = useCallback(
    (index: number, columnId: string) => {
      const newFilters = [...filters];
      newFilters[index] = { ...newFilters[index], columnId };
      setFilters(newFilters);
    },
    [filters]
  );

  const onOperatorChange = useCallback(
    (index: number, operator: FilterOperator) => {
      const newFilters = [...filters];
      newFilters[index] = { ...newFilters[index], operator };
      setFilters(newFilters);
    },
    [filters]
  );

  const onValueChange = useCallback(
    (index: number, value: string) => {
      const newFilters = [...filters];
      newFilters[index] = { ...newFilters[index], value };
      setFilters(newFilters);
    },
    [filters]
  );

  const onRemoveFilter = useCallback(
    (index: number) => {
      const newFilters = [...filters];
      newFilters.splice(index, 1);
      setFilters(newFilters);
    },
    [filters]
  );

  return (
    <Popover
      popover={
        <div className="rounded-theme-sm bg-background p-4 shadow-md">
          <div>
            {filters.map((f, index) => (
              <div key={index} className="mt-2 flex items-end gap-4">
                <Button
                  disabled={filters.length <= 1}
                  onClick={() => onRemoveFilter(index)}
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
                <Select
                  label="Colonna"
                  value={filterableColumns.find((c) => c.id === f.columnId)}
                  onChange={(val) => onColumnChange(index, val.id)}
                  values={filterableColumns}
                  renderLabel={(val) => val.label}
                />
                <Select
                  value={f.operator}
                  label="Operatore"
                  onChange={(val) => onOperatorChange(index, val)}
                  renderLabel={(c) => c}
                  values={
                    filterableColumns.find((c) => c.id === f.columnId)
                      ?.availableFilterOperators
                  }
                />
                <Input
                  label="Valore"
                  value={f.value as string | number}
                  onChange={(event) => onValueChange(index, event.target.value)}
                  type={typeof f.value === "number" ? "number" : "text"}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Button
              color="primary"
              onClick={() =>
                setFilters((prevState) => [...prevState, initFilters])
              }
            >
              Aggiungi <PlusIcon className="ml-2 w-4" />
            </Button>
            <Button
              color="primary"
              onClick={() => {
                onFiltersChange([]);
                setFilters([initFilters]);
              }}
            >
              Reset <XMarkIcon className="ml-2 w-4" />
            </Button>
            <Button
              className="ml-auto"
              color="primary"
              onClick={() => onFiltersChange(filters as Filter[])}
            >
              Applica
            </Button>
          </div>
        </div>
      }
    >
      <FunnelIcon className="h-4 w-4" />
    </Popover>
  );
}

export default Filters;
