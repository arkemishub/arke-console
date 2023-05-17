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
import Filters from "@/components/Table/Filters/Filters";

function Table(
  props: Pick<ITableProps, "columns" | "data" | "actions"> &
    Omit<IUseTableData<any, any>, "tableProps"> & {
      onFiltersChange?: (filters: Filter[]) => void;
      onSortChange?: (sort: Sort[]) => void;
    }
) {
  return (
    <>
      <div className="flex justify-end">
        {props.allColumns.some(
          (col) => (col?.availableFilterOperators?.length ?? 0) > 0
        ) && (
          <Filters
            allColumns={props.allColumns}
            filters={props.filters}
            onFiltersChange={(filters) => props.onFiltersChange?.(filters)}
          />
        )}
      </div>
      <ArkeTable {...props} setSort={(sort) => props.onSortChange?.(sort)} />
      <Pagination
        onChange={props.goToPage}
        currentPage={props.currentPage}
        pageCount={props.pageCount}
        totalCount={props.pageCount ?? 0}
      />
    </>
  );
}

export default Table;
