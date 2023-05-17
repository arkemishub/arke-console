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

import { cloneElement, ReactElement } from "react";

function HomepageCard({
  title,
  category,
  content,
  href,
  linkText,
  icon,
}: {
  title: string;
  category: string;
  content: string;
  href: string;
  linkText: string;
  icon: ReactElement;
}) {
  return (
    <div className="relative overflow-hidden rounded-theme border border-neutral bg-gradient-to-b from-background-400 to-background p-8">
      {cloneElement(icon, { className: "absolute -right-6 h-[150px]" })}
      <span className="text-sm text-primary">{category}</span>
      <p className="text-lg">{title}</p>
      <p className="mt-4 text-neutral-400">{content}</p>
      <a
        className="btn mt-4 inline-flex gap-4 bg-background-400 px-8"
        href={href}
        target="_blank"
      >
        <svg
          width="18"
          height="15"
          viewBox="0 0 18 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 7.11719H17M17 7.11719L11 1.11719M17 7.11719L11 13.1172"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {linkText}
      </a>
    </div>
  );
}

export default HomepageCard;
