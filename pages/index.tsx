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
  AddIcon,
  AdvantagesIcon,
  DocumentationIcon,
  SupportIcon,
} from "@/components/Icon";
import { acceptedRoles } from "@/arke/config";
import Divider from "@/components/Divider/Divider";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { getClient } from "@/arke/getClient";
import { TProject } from "@/types/project";
import toast from "react-hot-toast";
import { CrudState } from "@/types/crud";
import useClient from "@/arke/useClient";
import {
  CrudAddEdit as ProjectAdd,
  CrudAddEdit as ProjectEdit,
  CrudDelete as ProjectDelete,
} from "@/crud/common";
import { isMultiProjectConsole } from "@/utils/system";
import serverErrorRedirect from "@/server/serverErrorRedirect";

export default function Home(props: { projects: TProject[] }) {
  const client = useClient();
  const [projects, setProjects] = useState<TProject[]>(props.projects);
  const [crud, setCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });

  function loadData() {
    client.unit
      .getAll("arke_project")
      .then((res) => setProjects(res.data.content.items as TProject[]));
  }

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
            content="Discover Arke’s official technical documentation."
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

        <div className="mt-6">
          <Divider />
        </div>

        <div className="grid grid-cols-5 gap-4 py-6">
          <div
            className="relative flex cursor-pointer flex-col items-center justify-center rounded-theme
           border border-neutral bg-gradient-to-b from-background-400 to-background"
            onClick={() => setCrud((p) => ({ ...p, add: true }))}
          >
            <PlusIcon className="w-10 text-primary" />
            <p className="mt-2 uppercase text-primary">New project</p>
          </div>

          {projects.map((project) => (
            <ProjectCard
              key={project.arke_id}
              name={project.label}
              description={project.description}
              href={`/${project.id}/arke`}
              image={project.image}
            />
          ))}

          <ProjectAdd
            arkeId="arke_project"
            include={["id"]}
            title={
              <div className="flex items-center gap-4">
                <AddIcon className="text-primary" />
                Add Project
              </div>
            }
            open={crud.add}
            onClose={() => setCrud((p) => ({ ...p, add: false }))}
            onSubmit={() => {
              loadData();
              toast.success(`Project created correctly`);
              setCrud((p) => ({ ...p, add: false }));
            }}
          />
          <ProjectDelete
            arkeId="project"
            title="Delete Project"
            open={!!crud.delete}
            onClose={() => setCrud((p) => ({ ...p, delete: false }))}
            unitId={crud.delete as string}
            onSubmit={() => {
              loadData();
              toast.success(`Project deleted correctly`);
              setCrud((p) => ({ ...p, delete: false }));
            }}
          />
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  acceptedRoles,
  async (context) => {
    const client = getClient(context);
    try {
      const projects = await client.unit.getAll("arke_project");
      if (isMultiProjectConsole()) {
        return {
          props: {
            projects: projects.data.content.items,
          },
        };
      } else {
        return {
          redirect: {
            destination: `/${process.env.NEXT_PUBLIC_ARKE_PROJECT}`,
            permanent: false,
          },
        };
      }
    } catch (e) {
      return serverErrorRedirect(e);
    }
  }
);
