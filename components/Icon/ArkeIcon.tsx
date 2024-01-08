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

export function ArkeIcon({
  className,
  size = 18,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.00497 10.5558C8.07739 10.5558 8.9468 9.62558 8.9468 8.47808C8.9468 7.33062 8.07739 6.40039 7.00497 6.40039C5.93252 6.40039 5.06311 7.33062 5.06311 8.47808C5.06311 9.62558 5.93252 10.5558 7.00497 10.5558Z"
        fill="currentColor"
      />
      <path
        d="M14 0.932733C14 0.417599 13.5824 0 13.0673 0H0.932732C0.417599 0 0 0.417599 0 0.932733V0.932733C0 1.44787 0.417598 1.86547 0.932732 1.86547H13.0673C13.5824 1.86547 14 1.44787 14 0.932733V0.932733Z"
        fill="currentColor"
      />
      <path
        d="M14 16.1027C14 15.5875 13.5824 15.1699 13.0673 15.1699H0.932737C0.417601 15.1699 0 15.5875 0 16.1027V16.1027C0 16.6178 0.417601 17.0354 0.932737 17.0354H13.0673C13.5824 17.0354 14 16.6178 14 16.1027V16.1027Z"
        fill="currentColor"
      />
    </svg>
  );
}
