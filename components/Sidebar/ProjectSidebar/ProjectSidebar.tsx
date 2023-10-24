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

import Link from "next/link";
import {
  ArrowLeftOnRectangleIcon,
  TagIcon,
  UsersIcon,
  Squares2X2Icon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Image from "next/image";
import { CopyIcon, HomeIcon } from "@/components/Icon";
import { Button, Input } from "@arkejs/ui";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import { CompassIcon } from "@/components/Icon/CompassIcon";
import { ArkeIcon } from "@/components/Icon/ArkeIcon";
import SidebarItem from "@/components/Sidebar/SidebarItem";

function ProjectSidebar() {
  const { query } = useRouter();
  const project = query.project ?? getCookie("arke_project")?.toString();

  const handleCopy = () => {
    if (project) {
      navigator.clipboard
        .writeText(project as string)
        .then(() => toast.success("Project ID copied to clipboard"));
    }
  };

  return (
    <div className="h-full p-6">
      <aside className="flex h-full w-full flex-col rounded-theme bg-background-400 p-1">
        <Link href="/">
          <div className="flex items-center px-2 py-4">
            <Image
              src="/arke_logo.svg"
              alt="logo"
              height={30}
              width={92}
              className="mx-2"
            />
            <p className="ml-2 border-l border-l-neutral pl-3 text-neutral-400">
              Console
            </p>
          </div>
        </Link>
        <ul className="mt-1 flex h-full flex-col">
          <li className="relative mx-4 mb-8">
            <span className="mb-2 block text-xs text-neutral-400">
              Active Project
            </span>
            <Input
              value={project}
              readOnly
              className="project__input"
              suffixAdornment={
                <Button onClick={handleCopy} className="p-0">
                  <CopyIcon className="h-5 w-5" />
                </Button>
              }
            />
          </li>

          <div className="mb-4">
            <SidebarItem icon={HomeIcon} label="Return to Dashboard" href="/" />
          </div>

          <SidebarItem icon={ArkeIcon} label="Arke" href={`/${project}/arke`} />
          <SidebarItem
            icon={TagIcon}
            label="Parameters"
            href={`/${project}/parameters`}
          />
          <SidebarItem
            icon={Squares2X2Icon}
            label="Groups"
            href={`/${project}/groups`}
          />

          <SidebarItem
            icon={UsersIcon}
            label="Members"
            href={`/${project}/users`}
          />
          <SidebarItem
            icon={KeyIcon}
            label="Permissions"
            href={`/${project}/permissions`}
          />
          <SidebarItem
            icon={CompassIcon}
            label="Visual schema"
            href={`/${project}/visual-schema`}
          />

          <SidebarItem
            icon={ArrowLeftOnRectangleIcon}
            label="Logout"
            href="/logout"
            className="mt-auto"
          />
        </ul>
      </aside>
    </div>
  );
}

export default ProjectSidebar;
