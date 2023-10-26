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
import { acceptedRoles } from "@/arke/config";
import React from "react";
import { getSession } from "next-auth/react";
import { User } from "next-auth";

export default function Profile({ user }: { user: User }) {
  return (
    <>
      <Head>
        <title>Arke Console - Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <PageTitle showBreadcrumb={false} title="Profile" />
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(
  acceptedRoles,
  async (context) => {
    const session = await getSession(context);
    return {
      props: {
        user: session?.user,
      },
    };
  }
);
