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

import { Filter, Sort, useTable, IUseTableData, Column } from "@arkejs/table";
import { TUnit } from "@arkejs/client";
import { useState } from "react";
import useClient from "@/arke/useClient";
import { buildGetAllClientConfig, getTableDefaultConfig } from "@/utils/table";

type Fallback = {
  count?: number;
  data?: TUnit[];
};

type UseArkeTableReturn = {
  // todo: update this type
  tableProps: any;
  data: TUnit[] | undefined;
  count: number;
  isLoading: boolean;
  loadData: (params?: any) => void;
} & IUseTableData<any, any, any>;

export default function useArkeTable(
  kind: "arke" | "group",
  id: string,
  columns: TUnit[] | Column[],
  fallback?: Fallback
): UseArkeTableReturn {
  const client = useClient();

  const [data, setData] = useState<TUnit[] | undefined>(fallback?.data);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState<number>(fallback?.count ?? 0);

  // @ts-ignore
  const { tableProps, ...tableConfig } = useTable(
    getTableDefaultConfig(columns, count)
  );

  const loadData = async (params?: {
    page?: number;
    filters?: Filter[];
    sort?: Sort[];
  }) => {
    setIsLoading(true);

    const config = buildGetAllClientConfig({
      currentPage: params?.page ?? tableConfig.currentPage,
      filters: params?.filters ?? tableConfig.filters,
      sort: params?.sort ?? tableConfig.sort,
    });

    const response =
      kind === "arke"
        ? await client.unit.getAll(id, config)
        : await client.group.getAllUnits(id, config);

    setData(response.data.content.items);
    setCount(response.data.content.count);
    setIsLoading(false);
  };

  const goToPage = (page: number) => {
    tableConfig.goToPage(page);
    loadData({ page });
  };

  const onFiltersChange = (filters: Filter[]) => {
    tableConfig.setFilters(filters);
    loadData({ filters });
  };

  const onSortChange = (sort: Sort[]) => {
    tableConfig.setSort(sort);
    void loadData({ sort });
  };

  return {
    ...tableConfig,
    // @ts-ignore
    tableProps: { ...tableProps, goToPage, onFiltersChange, onSortChange },
    count,
    data,
    isLoading,
    loadData,
  };
}
