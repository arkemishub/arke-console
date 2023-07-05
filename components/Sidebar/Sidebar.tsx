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

import { ElementType, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeftOnRectangleIcon,
  SparklesIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { CopyIcon, HomeIcon } from "@/components/Icon";
import { Button, Input } from "@arkejs/ui";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import { CompassIcon } from "@/components/Icon/CompassIcon";
import {GroupIcon} from "@/components/Icon/GroupIcon";

function Sidebar() {
  const project =
    process.env.NEXT_PUBLIC_ARKE_PROJECT ??
    getCookie("arke_project")?.toString();

  const handleCopy = () => {
    if (project) {
      navigator.clipboard
        .writeText(project)
        .then(() => toast.success("Project ID copied to clipboard"));
    }
  };

  return (
    <div className="h-full p-6">
      <aside className="flex h-full w-full flex-col rounded-theme bg-background-400 p-1">
        <Link href="/">
          <div className="flex items-center px-2 py-4">
            <Image src="/logo.png" alt="logo" height={30} width={30} />

            <p className="ml-2 font-semibold">ARKE</p>
            <p className="ml-2 border-l border-l-neutral pl-2 text-neutral-400">
              Console
            </p>
          </div>
        </Link>
        <ul className="mt-8 flex h-full flex-col">
          <li className="relative mx-2 mb-8">
            <span className="mb-2 block text-xs text-neutral-400">
              Active Project
            </span>
            <Input value={project} readOnly className="project__input" />
            <Button
              onClick={handleCopy}
              className="absolute bottom-1 right-1 bg-neutral p-1.5 text-neutral-300"
            >
              <CopyIcon className="h-5 w-5" />
            </Button>
          </li>

          <SidebarItem icon={HomeIcon} label="Dashboard" href="/" />
          <SidebarItem icon={SparklesIcon} label="Arke" href="/arke" />
          <SidebarItem icon={TagIcon} label="Parameters" href="/parameters" />
          <SidebarItem icon={GroupIcon} label="Groups" href="/groups" />
          <SidebarItem icon={UserIcon} label="Users" href="/users" />
          <SidebarItem
            icon={CompassIcon}
            label="Visual schema"
            href="/visual-schema"
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

function SidebarItem({
  icon,
  label,
  href,
  className,
}: {
  icon: ElementType;
  label: string;
  href: string;
  className?: string;
}) {
  const router = useRouter();

  const isActive = useMemo(() => router.asPath === href, [href, router]);

  const Icon = icon;
  return (
    <li className={twMerge("px-2 py-1", className)}>
      <Link
        href={href}
        className={twMerge(
          "flex items-center gap-3 p-2 text-neutral-400",
          isActive &&
            "rounded-theme border-background bg-gradient-to-r from-primary-800 to-transparent text-background-contrast"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Link>
    </li>
  );
}

export default Sidebar;
