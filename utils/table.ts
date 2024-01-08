/*
 * Copyright 2023 Arkemis S.r.l.
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

import {
  Column,
  IPaginationConfig,
  ISortConfig,
  IUseTableConfig,
  IUseTableData,
} from "@arkejs/table";
import { TUnit } from "@arkejs/client";

export const DEFAULT_PAGE_SIZE = 10;

type BuildClientConfigParams = Pick<
  IUseTableData<any, any, any>,
  "filters" | "currentPage" | "sort"
> & {
  operator?: "and" | "or";
  include?: string[];
};

function buildGetAllClientConfig({
  filters,
  sort,
  currentPage,
  operator = "and",
}: BuildClientConfigParams) {
  return {
    params: {
      filter:
        filters && filters?.length > 0
          ? `${operator}(${filters.map(
              (f) => `${f.operator}(${f.columnId},${f.value})`
            )})`
          : null,
      offset: (currentPage ?? 0) * DEFAULT_PAGE_SIZE,
      limit: DEFAULT_PAGE_SIZE,
      order: sort?.map((sort) => `${sort.columnId};${sort.type}`),
      load_values: true,
      load_links: true,
      load_files: true,
    },
  };
}

function getTableDefaultConfig(
  columns: TUnit[] | Column[],
  count: number
): IUseTableConfig<IPaginationConfig, ISortConfig, false> | null {
  if (typeof count === "undefined") return null;

  return {
    pagination: {
      totalCount: count,
      type: "custom",
      pageSize: DEFAULT_PAGE_SIZE,
    },
    columns: columns as Column[],
    sorting: {
      type: "custom",
      sortable: true,
    },
  };
}

export { buildGetAllClientConfig, getTableDefaultConfig };
