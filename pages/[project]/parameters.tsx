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

import { useState } from "react";
import { TUnit } from "@arkejs/client";
import { CrudState } from "@/types/crud";
import { ParameterAdd, columns } from "@/crud/parameter";
import {
  CrudAddEdit as ParameterEdit,
  CrudDelete as ParameterDelete,
} from "@/crud/common";
import { PageTitle } from "@/components/PageTitle";
import { Button } from "@arkejs/ui";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import { getClient } from "@/arke/getClient";
import { ProjectLayout } from "@/components/Layout";
import { Table } from "@/components/Table";
import { AddIcon, EditIcon, TrashIcon } from "@/components/Icon";
import toast from "react-hot-toast";
import { acceptedRoles } from "@/arke/config";
import useArkeTable from "@/hooks/useArkeTable";

function Parameters(props: { parameters: TUnit[]; count: number }) {
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });

  const {
    data: parameters,
    loadData,
    isLoading,
    tableProps,
  } = useArkeTable("group", "parameter", columns, {
    data: props.parameters,
    count: props.count,
  });

  return (
    <ProjectLayout>
      <PageTitle
        title="Parameters"
        action={
          <Button
            color="primary"
            onClick={() =>
              setCrud((prevState) => ({ ...prevState, add: true }))
            }
          >
            Add Parameter
          </Button>
        }
      />
      <Table
        data={parameters}
        loading={isLoading}
        actions={{
          label: "",
          actions: [
            {
              content: <PencilIcon className="h-4 w-4" />,
              onClick: (rowData) => {
                setCrud((prevState) => ({
                  ...prevState,
                  edit: {
                    unitId: rowData?.id as string,
                    arkeId: rowData?.arke_id as string,
                  },
                }));
              },
            },
            {
              content: <XMarkIcon className="h-4 w-4" />,
              onClick: (rowData) =>
                setCrud((prevState) => ({
                  ...prevState,
                  delete: {
                    unitId: rowData?.id as string,
                    arkeId: rowData?.arke_id as string,
                  },
                })),
            },
          ],
        }}
        {...tableProps}
        noResult={
          <div className="flex flex-col items-center p-4 py-8 text-center">
            <div className="rounded-full bg-background-400 p-6">
              <AddIcon className="h-12 w-12 text-primary" />
            </div>
            <span className="mt-4 text-xl">
              Create your first Parameter to get started.
            </span>
            Do you need a hand? Check out our documentation.
            <div className="mt-4 flex">
              <Button
                className="border"
                onClick={() =>
                  setCrud((prevState) => ({ ...prevState, add: true }))
                }
              >
                Add Parameter
              </Button>
            </div>
          </div>
        }
      />

      <ParameterAdd
        title={
          <div className="flex items-center gap-4">
            <AddIcon className="text-primary" />
            Add Parameter
          </div>
        }
        open={crud.add}
        onClose={() => setCrud((p) => ({ ...p, add: false }))}
        onSubmit={(res) => {
          loadData();
          toast.success(`Parameter ${res.data.content.id} created correctly`);
          setCrud((p) => ({ ...p, add: false }));
        }}
      />
      <ParameterEdit
        title={
          <div className="flex items-center gap-4">
            <EditIcon className="text-primary" />
            Edit Parameter
          </div>
        }
        open={!!crud.edit}
        arkeId={
          typeof crud.edit === "object" ? (crud.edit?.arkeId as string) : ""
        }
        unitId={
          typeof crud.edit === "object" ? (crud?.edit?.unitId as string) : ""
        }
        onClose={() => setCrud((p) => ({ ...p, edit: false }))}
        onSubmit={(res) => {
          loadData();
          toast.success(`Parameter ${res.data.content.id} edited correctly`);
          setCrud((p) => ({ ...p, edit: false }));
        }}
      />
      <ParameterDelete
        title={
          <div className="flex items-center gap-4">
            <TrashIcon className="text-error" />
            Delete Parameter
          </div>
        }
        open={!!crud.delete}
        onClose={() => setCrud((p) => ({ ...p, delete: false }))}
        arkeId={
          typeof crud.delete === "object"
            ? (crud?.delete?.arkeId as string)
            : ""
        }
        unitId={
          typeof crud.delete === "object"
            ? (crud?.delete?.unitId as string)
            : ""
        }
        onSubmit={() => {
          loadData();
          toast.success(`Parameter deleted correctly`);
          setCrud((p) => ({ ...p, delete: false }));
        }}
      />
    </ProjectLayout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  acceptedRoles,
  async (context) => {
    const client = getClient(context);

    try {
      const response = await client.group.getAllUnits("parameter");

      return {
        props: {
          parameters: response.data.content.items,
          count: response.data.content.count,
        },
      };
    } catch (e) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }
  }
);

export default Parameters;
