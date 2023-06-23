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

import Head from "next/head";

import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import { Layout } from "@/components/Layout";
import { PageTitle } from "@/components/PageTitle";
import { HomepageCard } from "@/components/HomepageCard";
import {
  AdvantagesIcon,
  DocumentationIcon,
  SupportIcon,
} from "@/components/Icon";

export default function Home() {
  return (
    <>
      <Head>
        <title>Arke Console</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PageTitle showBreadcrumb={false} title="Dashboard" />
        <div className="grid grid-cols-3 gap-4">
          <HomepageCard
            category="Advantages"
            title="Develop with arke"
            content="Optimize time with a scalable development."
            href="https://arkehub.com"
            linkText="Discover Arke"
            icon={<AdvantagesIcon />}
          />
          <HomepageCard
            category="Docs"
            title="Documentation"
            content="Discover Arke’s technical documentation."
            href="https://arkemishub.github.io/docs"
            linkText="Learn More"
            icon={<DocumentationIcon />}
          />
          <HomepageCard
            category="Support"
            title="Contact us"
            content="Do you need support? Our experts will help you."
            href="https://discord.gg/947C6JArtM"
            linkText="Contact us"
            icon={<SupportIcon />}
          />
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(() => {
  return { props: {} };
});
