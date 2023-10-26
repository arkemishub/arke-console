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

import { TUnit } from "@arkejs/client";
import { Tabs, Button } from "@arkejs/ui";
import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import { getClient } from "@/arke/getClient";
import { UnitsTab } from "@/components/UnitsTab";
import { ProjectLayout } from "@/components/Layout";
import { PageTitle } from "@/components/PageTitle";
import { AssignParametersTab } from "@/components/AssignParametersTab";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { acceptedRoles } from "@/arke/config";
const ApiDocsDrawer = dynamic(
  () => import("@/components/ApiDocs").then((mod) => mod.ApiDocsDrawer),
  { ssr: false }
);

function ArkeDetail({ detail }: { detail: TUnit }) {
  const [isApiDocsDrawerOpen, setIsApiDocsOpen] = useState(false);
  const router = useRouter();
  const tabs = [
    { value: 0, id: "units", label: "Units" },
    { value: 1, id: "parameters", label: "Parameters" },
    { value: 2, id: "struct", label: "Struct" },
  ];
  const getTab = (value: string | number, key: "id" | "value" = "id") =>
    tabs.find((item) => item[key] === value);
  const activeTab = useMemo(() => {
    const hash = router.asPath.split("#")[1];
    if (hash) {
      if (hash === "units") return getTab("units")?.value;
      if (hash === "parameters") return getTab("parameters")?.value;
      if (hash === "struct") return getTab("struct")?.value;
    }
  }, [router.asPath]);

  return (
    <ProjectLayout>
      <>
        <PageTitle
          title={detail?.label as string}
          action={
            <Button
              className="btn--background-contrast btn--outlined flex gap-2 text-sm"
              onClick={() => setIsApiDocsOpen(true)}
            >
              <CodeBracketIcon className="h-4 w-4" />
              Api Docs
            </Button>
          }
        />
        <Tabs
          active={activeTab}
          onChange={(value) => {
            const tab = getTab(value, "value");
            void router.push(`${router.asPath.split("#")[0]}#${tab?.id}`);
          }}
        >
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.id}>{tab.label}</Tabs.Tab>
          ))}
          <Tabs.TabPanel>
            <UnitsTab arke={detail} />
          </Tabs.TabPanel>
          <Tabs.TabPanel>
            <AssignParametersTab arke={detail} />
          </Tabs.TabPanel>
          <Tabs.TabPanel>
            <ul>
              {Object.entries(detail).map(([key, value]) => (
                <li
                  className="mb-2 flex items-center gap-4 rounded-theme bg-background-300 px-4 py-2"
                  key={key}
                >
                  <div className="w-[200px] overflow-x-hidden text-ellipsis whitespace-nowrap border-r border-r-neutral text-sm uppercase text-neutral-400">
                    {key}
                  </div>
                  <div className="text-sm">
                    {value ? JSON.stringify(value) : "-"}
                  </div>
                </li>
              ))}
            </ul>
          </Tabs.TabPanel>
        </Tabs>
      </>
      <ApiDocsDrawer
        kind="arke"
        open={isApiDocsDrawerOpen}
        onClose={() => setIsApiDocsOpen(false)}
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
        "arke",
        context.query.arkeId as string
      );
      return {
        props: {
          detail: response.data.content,
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

export default ArkeDetail;
