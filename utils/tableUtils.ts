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

import { Client, LinkDirection, TUnit } from "@arkejs/client";
import {
  Column,
  Filter,
  IPaginationConfig,
  ISortConfig,
  IUseTableConfig,
  Sort,
} from "@arkejs/table";
export const DEFAULT_PAGE_SIZE = 10;
export interface GetTableParams {
  client: Client;
  arkeOrGroupId: string;
  page?: number;
  filters?: Filter[];
  sort?: Sort[];
  operator?: "and" | "or";
  arkeOrGroup?: "arke" | "group";
}
export const getTableData = async (params: GetTableParams) => {
  const {
    client,
    arkeOrGroupId,
    page,
    filters,
    sort,
    operator = "and",
    arkeOrGroup = "arke",
  } = params;

  const config = {
    params: {
      filter:
        filters && filters?.length > 0
          ? `${operator}(${filters.map(
              (f) => `${f.operator}(${f.columnId},${f.value})`
            )})`
          : null,
      offset: (page ?? 0) * DEFAULT_PAGE_SIZE,
      limit: DEFAULT_PAGE_SIZE,
      order: sort?.map((sort) => `${sort.columnId};${sort.type}`),
      load_values: true,
      load_links: true,
      load_files: true,
    },
  };

  return arkeOrGroup === "arke"
    ? client.unit.getAll(arkeOrGroupId, config)
    : client.group.getAllUnits(arkeOrGroupId, config);
};
export const getTableLinkedData = async (
  params: GetTableParams & { id: string }
) => {
  const {
    client,
    arkeOrGroupId,
    id,
    page,
    filters,
    sort,
    operator = "and",
  } = params;

  return client.unit.topology.getLinks(
    { arkeId: arkeOrGroupId, id: id as string },
    LinkDirection.Child,
    {
      params: {
        filter:
          filters && filters?.length > 0
            ? `${operator}(${filters.map(
                (f) => `${f.operator}(${f.columnId},${f.value})`
              )})`
            : null,
        offset: (page ?? 0) * DEFAULT_PAGE_SIZE,
        limit: DEFAULT_PAGE_SIZE,
        order: sort?.map((sort) => `${sort.columnId};${sort.type}`),
        load_values: true,
        load_links: true,
      },
    }
  );
};

export const getTableColumns = async (params: GetTableParams) => {
  const {
    client,
    arkeOrGroupId,
    page,
    filters,
    sort,
    arkeOrGroup = "arke",
  } = params;

  const exclude = [
    "id",
    "active",
    "arke_id",
    "type",
    "metadata",
    "inserted_at",
    "updated_at",
    "parameters",
  ];

  const config = {
    params: {
      exclude,
      filter:
        filters && filters?.length > 0
          ? `and(${filters.map(
              (f) => `${f.operator}(${f.columnId},${f.value})`
            )})`
          : null,
      offset: (page ?? 0) * DEFAULT_PAGE_SIZE,
      limit: DEFAULT_PAGE_SIZE,
      order: sort?.map((sort) => `${sort.columnId};${sort.type}`),
      load_links: true,
      load_files: true,
    },
  };

  return arkeOrGroup === "arke"
    ? client.arke.struct(arkeOrGroupId, config)
    : client.group.struct(arkeOrGroupId, config);
};

export const getTableConfig = (
  columns: TUnit[] | Column[],
  count: number
): IUseTableConfig<IPaginationConfig, ISortConfig, false> | any => {
  return typeof count !== "undefined"
    ? {
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
      }
    : null;
};
