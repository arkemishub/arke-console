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

import { ElementType, HTMLAttributeAnchorTarget, useMemo } from "react";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
export default function SidebarItem({
  icon,
  label,
  href,
  target,
  className,
}: {
  icon?: ElementType;
  label: string;
  href: string;
  target?: HTMLAttributeAnchorTarget;
  className?: string;
}) {
  const router = useRouter();

  const isActive = useMemo(() => router.asPath === href, [href, router]);

  const Icon = icon;
  return (
    <li className={twMerge("px-2 py-1", className)}>
      <Link
        href={href}
        target={target}
        className={twMerge(
          "flex items-center gap-3 p-2 text-neutral-400",
          isActive &&
            "rounded-theme border-background bg-gradient-to-r from-primary-800 to-transparent text-background-contrast"
        )}
      >
        {Icon && <Icon className="h-5 w-5" />}
        <span>{label}</span>
      </Link>
    </li>
  );
}
