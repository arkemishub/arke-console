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
import { ArkeIcon } from "@/components/Icon/ArkeIcon";

function ProjectCard({
  name,
  description,
  href,
}: {
  name: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="relative cursor-pointer overflow-hidden rounded-theme border border-neutral bg-gradient-to-b from-background-400 to-background text-center"
    >
      <div className="flex h-28 items-center justify-center">
        <ArkeIcon size={42} />
      </div>
      <div className="border-t border-neutral p-2 px-4">
        <p className="text-md uppercase">{name}</p>
        <p className="text-sm text-neutral-400">{description}</p>
      </div>
    </Link>
  );
}

export default ProjectCard;
