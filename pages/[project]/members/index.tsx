import { useCallback, useState } from "react";
import { Filter, Sort, useTable } from "@arkejs/table";
import {
  BanknotesIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CrudState } from "@/types/crud";
import { TUnit } from "@arkejs/client";
import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import { getClient } from "@/arke/getClient";
import useClient from "@/arke/useClient";
import {
  getTableColumns,
  getTableConfig,
  getTableData,
} from "@/utils/tableUtils";
import { Table } from "@/components/Table";
import { Button, Input } from "@arkejs/ui";
import {
  MemberCrud as MemberAdd,
  MemberCrud as MemberEdit,
} from "@/crud/member/MemberCrud";
import { columns } from "@/crud/member";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { PageTitle } from "@/components/PageTitle";
import { AddIcon } from "@/components/Icon";
import { ProjectLayout } from "@/components/Layout";
import serverErrorRedirect from "@/server/serverErrorRedirect";
import { acceptedRoles } from "@/arke/config";

export default function Members(props: {
  data: TUnit[];
  columns: TUnit[];
  count: number;
}) {
  const client = useClient();
  const router = useRouter();
  const [data, setData] = useState<TUnit[]>(props.data);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(props.count);
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });
  const [selected, setSelected] = useState<Record<string, unknown>>();
  const {
    setFilters,
    tableProps,
    sort,
    setSort,
    filters,
    goToPage,
    currentPage,
  } = useTable(getTableConfig(columns, count));

  const loadData = useCallback(
    (
      page?: number,
      filters?: Filter[],
      sort?: Sort[],
      operator?: "and" | "or"
    ) => {
      setIsLoading(true);
      getTableData({
        client,
        arkeOrGroup: "group",
        arkeOrGroupId: "member_group",
        page,
        filters,
        sort,
        operator,
      }).then((res) => {
        setData(res.data.content.items);
        setCount(res.data.content.count);
        setIsLoading(false);
      });
    },
    []
  );

  return (
    <ProjectLayout>
      <PageTitle
        title="Members"
        action={
          <Button
            color="primary"
            onClick={() =>
              setCrud((prevState) => ({ ...prevState, add: true }))
            }
          >
            Add Member
          </Button>
        }
      />

      <>
        <Table
          data={data}
          loading={isLoading}
          actions={{
            label: "",
            actions: [
              {
                content: <PencilIcon className="h-4 w-4" />,
                onClick: (rowData) => {
                  setSelected(rowData);
                  setCrud((prevState) => ({
                    ...prevState,
                    edit: rowData?.id as string,
                  }));
                },
              },
              {
                content: <XMarkIcon className="h-4 w-4" />,
                onClick: (rowData) => {
                  setSelected(rowData);
                  setCrud((prevState) => ({
                    ...prevState,
                    delete: rowData?.id as string,
                  }));
                },
              },
              {
                content: <BanknotesIcon className="h-4 w-4" />,
                onClick: (rowData) => {
                  void router.push(`/staff/users/${rowData?.id}/commission`);
                },
              },
            ],
          }}
          {...tableProps}
          goToPage={(page: number) => {
            goToPage(page);
            loadData(page, filters, sort);
          }}
          onFiltersChange={(filters) => {
            setFilters(filters);
            loadData(currentPage, filters, sort);
          }}
          onSortChange={(sort) => {
            setSort(sort);
            loadData(currentPage, filters, sort);
          }}
          noResult="Nessun risultato trovato"
          filterable={false}
        />
      </>

      <MemberAdd
        title={
          <div className="flex items-center gap-4">
            <AddIcon className="text-primary" />
            Add member
          </div>
        }
        open={crud.add}
        onClose={() => setCrud((p) => ({ ...p, add: false }))}
        onSubmit={(res) => {
          loadData();
          toast.success(`Member created correctly`);
          setCrud((p) => ({ ...p, add: false }));
        }}
      />

      <MemberEdit
        title={
          <div className="flex items-center gap-4">
            <AddIcon className="text-primary" />
            Edit member
          </div>
        }
        open={crud.add}
        onClose={() => setCrud((p) => ({ ...p, add: false }))}
        onSubmit={(res) => {
          loadData();
          toast.success(`Member edited correctly`);
          setCrud((p) => ({ ...p, add: false }));
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
      const responseStruct = await getTableColumns({
        client,
        arkeOrGroup: "group",
        arkeOrGroupId: "member_group",
      });
      const responseGetAll = await getTableData({
        client,
        arkeOrGroup: "group",
        arkeOrGroupId: "member_group",
      });

      return {
        props: {
          columns: responseStruct.data.content.parameters,
          data: responseGetAll.data.content.items,
          count: responseGetAll.data.content.count,
        },
      };
    } catch (e) {
      return serverErrorRedirect(e);
    }
  }
);
