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

import React, { useCallback, useEffect, useState } from "react";
import { Client, LinkDirection, TUnit } from "@arkejs/client";
import { CrudState } from "@/types/crud";
import { PageTitle } from "@/components/PageTitle";
import { Accordion, Button } from "@arkejs/ui";
import { getClient } from "@/arke/getClient";
import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import { Layout } from "@/components/Layout";
import { acceptedRoles } from "@/arke/config";
import { Filter, Sort, useTable } from "@arkejs/table";
import { columns } from "@/crud/permission/columns";
import { ExpandIcon } from "@/components/Icon/ExpandIcon";
import useClient from "@/arke/useClient";
import { AddIcon } from "@/components/Icon";
import { Table } from "@/components/Table";
import { PermissionTable } from "@/components/Permissions/PermissionTable";

function Permissions(props: { data: TUnit[]; count: number }) {
  const { data } = props;
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    data.reduce((accumulator, value) => {
      return { ...accumulator, [value.id]: false };
    }, {})
  );

  return (
    <Layout>
      <PageTitle title="Permissions" />
      {data.map((item) => (
        <div key={item.id}>
          <Accordion
            expanded={expanded[item.id]}
            onChange={() =>
              setExpanded((p) => ({ ...p, [item.id]: !expanded[item.id] }))
            }
          >
            <Accordion.Summary expandIcon={<ExpandIcon />}>
              <h1 className="text-2xl">{item.label}</h1>
            </Accordion.Summary>
            <Accordion.Detail>
              <div className="flex justify-end">
                <Button
                  className="mt-4"
                  color="primary"
                  onClick={() =>
                    setCrud((prevState) => ({ ...prevState, add: true }))
                  }
                >
                  Add Permission
                </Button>
              </div>
              <PermissionTable role={item.id} />
            </Accordion.Detail>
          </Accordion>
          <hr className="my-2 opacity-20" />
        </div>
      ))}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  acceptedRoles,
  async (context) => {
    const client = getClient(context);
    const fetchMembers = async () => {
      return client.group.topology.getLinks(
        { id: "arke_auth_member", groupId: "group" },
        LinkDirection.Child,
        {
          params: {
            link_type: "group",
            depth: 0,
          },
        }
      );
    };

    const response = await fetchMembers();
    return {
      props: {
        data: response.data.content.items,
        count: response.data.content.count,
      },
    };
  }
);

export default Permissions;