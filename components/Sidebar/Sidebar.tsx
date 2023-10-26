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
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Image from "next/image";
import { CopyIcon, HomeIcon } from "@/components/Icon";
import { Button, Input } from "@arkejs/ui";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import { ProfileIcon } from "@/components/Icon/ProfileIcon";
import { SettingsIcon } from "@/components/Icon/SettingsIcon";
import { BookOpenIcon } from "@/components/Icon/BookOpenIcon";
import { AlertSquareIcon } from "@/components/Icon/AlertSquareIcon";
import { MessageChatSquareIcon } from "@/components/Icon/MessageChatSquareIcon";

function Sidebar() {
  const { query } = useRouter();
  const project = query.project ?? getCookie("arke_project")?.toString();

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
        <ul className="mt-8 flex h-full flex-col">
          <SidebarItem icon={HomeIcon} label="Dashboard" href="/" />

          {/*<p className="p-4">Account</p>
          <div className="ml-4 border-l border-gray-500 pl-2">
            <SidebarItem icon={ProfileIcon} label="Profile" href="/profile" />
            <SidebarItem
              icon={SettingsIcon}
              label="Preferences"
              href="/preferences"
            />
          </div>*/}

          <p className="p-4">Organization</p>
          <div className="ml-4 border-l border-gray-500 pl-2">
            <SidebarItem icon={UsersIcon} label="Users" href="/users" />
          </div>

          <p className="p-4">Documentation</p>
          <div className="ml-4 border-l border-gray-500 pl-2">
            <SidebarItem
              icon={BookOpenIcon}
              label="Guide"
              href="https://arkemishub.github.io/docs"
              target="_blank"
            />
          </div>

          <p className="p-4">Support</p>
          <div className="ml-4 border-l border-gray-500 pl-2">
            <SidebarItem
              icon={AlertSquareIcon}
              label="Report a problem"
              href="https://github.com/arkemishub"
              target="_blank"
            />
            <SidebarItem
              icon={MessageChatSquareIcon}
              label="Support chat"
              href="https://discord.com/invite/947C6JArtM"
              target="_blank"
            />
          </div>

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

export default Sidebar;
