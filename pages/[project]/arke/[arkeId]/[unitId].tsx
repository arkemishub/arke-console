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

import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import { getClient } from "@/arke/getClient";
import { TUnit } from "@arkejs/client";
import { Button } from "@arkejs/ui";
import { useState } from "react";
import { CrudState } from "@/types/crud";
import {
  CrudAddEdit as UnitEdit,
  CrudDelete as UnitDelete,
} from "@/crud/common";
import { ProjectLayout } from "@/components/Layout";
import { PageTitle } from "@/components/PageTitle";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { acceptedRoles } from "@/arke/config";
import { TFile } from "@/types/file";
import dynamic from "next/dynamic";
import { isImage } from "@/utils/file";
import Image from "next/image";

const Json = dynamic(() => import("@arkejs/ui").then((module) => module.Json), {
  ssr: false,
});

function UnitDetail({ detail }: { detail: TUnit }) {
  const [crud, setCrud] = useState<CrudState>({
    edit: false,
    delete: false,
  });
  const router = useRouter();
  const {
    query: { project },
  } = router;

  function getValue(value: TFile) {
    if (typeof value !== "undefined" && value !== null) {
      if (value?.arke_id === "arke_file") {
        return (
          <div className="flex w-full items-center gap-6">
            <a
              href={value?.signed_url}
              target="_blank"
              className="cursor-pointer"
            >
              {isImage(value.extension) && (
                <Image
                  alt={value.id}
                  src={value?.signed_url}
                  width={100}
                  height={100}
                />
              )}
            </a>
            <div className="w-full">
              <Json
                value={JSON.stringify(value, null, "\t") ?? ""}
                className="h-28 w-80"
              />
            </div>
          </div>
        );
      } else {
        return <div className="text-sm">{JSON.stringify(value)}</div>;
      }
    } else {
      return <div className="text-sm">-</div>;
    }
  }

  return (
    <ProjectLayout>
      <PageTitle
        title={detail?.id as string}
        action={
          <div className="flex gap-4">
            <Button
              onClick={() =>
                setCrud((prevState) => ({ ...prevState, edit: true }))
              }
              color="secondary"
            >
              Edit
            </Button>
            <Button
              onClick={() =>
                setCrud((prevState) => ({ ...prevState, delete: true }))
              }
              color="secondary"
            >
              Delete
            </Button>
          </div>
        }
      />
      <ul>
        {Object.entries(detail).map(([key, value]) => (
          <li
            className="mb-2 flex items-center gap-4 rounded-theme bg-background-300 px-4 py-2"
            key={key}
          >
            <div
              className="w-[200px] overflow-x-hidden text-ellipsis whitespace-nowrap border-r border-r-neutral text-sm uppercase text-neutral-400"
              style={{ minWidth: 200 }}
            >
              {key}
            </div>
            {getValue(value as TFile)}
          </li>
        ))}
      </ul>
      <UnitEdit
        arkeId={detail.arke_id as string}
        unitId={detail.id}
        open={!!crud.edit}
        title="Edit"
        onClose={() => setCrud((prevState) => ({ ...prevState, edit: false }))}
        onSubmit={() => {
          toast.success(`Unit edited correctly`);
          setCrud((prevState) => ({ ...prevState, edit: false }));
        }}
      />
      <UnitDelete
        arkeId={detail.arke_id as string}
        unitId={detail.id as string}
        open={!!crud.delete}
        title="Delete"
        onClose={() =>
          setCrud((prevState) => ({ ...prevState, delete: false }))
        }
        onSubmit={() => {
          toast.success(`Unit deleted correctly`);
          setCrud((prevState) => ({ ...prevState, delete: false }));
          void router.push(`/${project}/arke/${detail.arke_id}#units`);
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
      const response = await client.unit.get(
        context.query.arkeId as string,
        context.query.unitId as string,
        { params: { load_links: true, load_files: true } }
      );

      return { props: { detail: response.data.content } };
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

export default UnitDetail;
