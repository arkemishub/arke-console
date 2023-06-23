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

import { PropsWithChildren, ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";

interface LayoutProps {
  children: ReactNode;
  showDemoBanner?: boolean;
}

function Layout({ children, showDemoBanner = false }: LayoutProps) {
  return (
    <>
      {showDemoBanner && (
        <div className="bg-background-200 p-2 text-center text-sm">
          This is a demo of Arke Console. The database resets every hour. To
          login, use username:admin and Password:admin
        </div>
      )}
      <div className="grid h-screen grid-cols-[300px_auto]">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </>
  );
}

export default Layout;
