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

import { ReactElement } from "react";
import { twMerge } from "tailwind-merge";
import { Breadcrumb } from "@arkejs/ui";
import { useRouter } from "next/router";
import Link from "next/link";
import { HomeIcon } from "@/components/Icon";
import Divider from "@/components/Divider/Divider";

function PageTitle({
  title,
  action,
  className,
  showBreadcrumb = true,
}: {
  title: string;
  action?: ReactElement;
  className?: string;
  showBreadcrumb?: boolean;
}) {
  const router = useRouter();
  const routes = router.asPath.split("/");

  return (
    <div className="sticky top-0 z-10 bg-background py-4 pt-10">
      <div className={twMerge("flex items-center justify-between ", className)}>
        {title && <h1 className="text-4xl">{title}</h1>}
        {action ?? null}
      </div>
      {showBreadcrumb && (
        <>
          <Breadcrumb className="mt-4">
            {routes.map((item, index) => (
              <Breadcrumb.Crumb
                key={index}
                className={twMerge(
                  index === routes.length - 1 && "text-neutral-400"
                )}
              >
                <Link
                  href={
                    `${
                      routes
                        .slice(0, index + 1)
                        .join("/")
                        .split("#")[0]
                    }` || "/"
                  }
                >
                  {item === "" ? (
                    <HomeIcon className="h-4 w-4" />
                  ) : (
                    item.split("#")[0]
                  )}
                </Link>
              </Breadcrumb.Crumb>
            ))}
          </Breadcrumb>
          <div className="mt-4">
            <Divider />
          </div>
        </>
      )}
    </div>
  );
}

export default PageTitle;
