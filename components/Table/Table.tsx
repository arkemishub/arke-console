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
  Table as ArkeTable,
  ITableProps,
  IUseTableData,
  Filter,
  Sort,
} from "@arkejs/table";
import Pagination from "./Pagination/Pagination";
import InlineFilter from "@/components/Table/Filters/InlineFilter";
import { Spinner } from "@arkejs/ui";
import { twMerge } from "tailwind-merge";

function Table(
  props: Pick<ITableProps, "columns" | "data" | "actions" | "noResult"> &
    Omit<IUseTableData<any, any, true>, "tableProps"> & {
      onFiltersChange?: (filters: Filter[]) => void;
      onSortChange?: (sort: Sort[]) => void;
      filterable?: boolean;
      loading?: boolean;
    }
) {
  return (
    <div className="relative min-h-[400px]">
      {props.loading && (
        <div
          className={twMerge(
            "absolute z-20 flex h-full w-full flex-col items-center justify-center gap-4 bg-background",
            props.filterable ? "top-[110px]" : "top[90px]"
          )}
        >
          <p>Loading...</p>
          <Spinner />
        </div>
      )}
      <div className="overflow-x-auto">
        <ArkeTable
          {...props}
          renderHeader={(column) => (
            <InlineFilter
              filterable={props.filterable}
              sort={props.sort}
              filters={props.filters}
              column={column}
              onFiltersChange={props.onFiltersChange}
              onSortChange={props.onSortChange}
              sortable={props.sortable}
            />
          )}
          setSort={(sort) => props.onSortChange?.(sort)}
        />
        <Pagination
          onChange={props.goToPage}
          currentPage={props.currentPage}
          pageCount={props.pageCount}
          totalCount={props.totalCount ?? 0}
        />
      </div>
    </div>
  );
}

export default Table;
