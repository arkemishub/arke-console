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
import { Tabs } from "@arkejs/ui";
import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import { getClient } from "@/arke/getClient";
import { UnitsTab } from "@/components/UnitsTab";
import { Layout } from "@/components/Layout";
import { PageTitle } from "@/components/PageTitle";
import { LinkedParametersTab } from "@/components/LinkedParametersTab";

function ArkeDetail({ detail }: { detail: TUnit }) {
  return (
    <Layout>
      <>
        <PageTitle title={detail?.label as string} />
        <Tabs>
          <Tabs.Tab>Units</Tabs.Tab>
          <Tabs.Tab>Parameters</Tabs.Tab>
          <Tabs.Tab>Struct</Tabs.Tab>
          <Tabs.TabPanel>
            <UnitsTab arke={detail} />
          </Tabs.TabPanel>
          <Tabs.TabPanel>
            <LinkedParametersTab arke={detail} />
          </Tabs.TabPanel>
          <Tabs.TabPanel>
            <ul>
              {Object.entries(detail).map(([key, value]) => (
                <li
                  className="mb-2 flex items-center gap-4 rounded-theme bg-background-300 py-2 px-4"
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
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
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
