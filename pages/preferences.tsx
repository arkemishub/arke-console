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
import { acceptedRoles } from "@/arke/config";
import Divider from "@/components/Divider/Divider";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { getClient } from "@/arke/getClient";
import { Project } from "@/types/project";

export default function Preferences() {
  return (
    <>
      <Head>
        <title>Arke Console - Preferences</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PageTitle showBreadcrumb={false} title="Preferences" />
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  acceptedRoles,
  () => {
    return {
      props: {},
    };
  }
);
