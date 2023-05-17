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

export function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.09451 10.1163C5.42755 11.4102 6.60212 12.3663 8 12.3663C9.39788 12.3663 10.5725 11.4102 10.9055 10.1163M7.26327 1.68927L2.17654 5.64562C1.83652 5.91008 1.6665 6.04231 1.54402 6.20791C1.43552 6.35461 1.3547 6.51986 1.30552 6.69556C1.25 6.89391 1.25 7.10929 1.25 7.54006V12.9663C1.25 13.8063 1.25 14.2264 1.41349 14.5472C1.5573 14.8295 1.78677 15.059 2.06901 15.2028C2.38988 15.3663 2.80992 15.3663 3.65 15.3663H12.35C13.1901 15.3663 13.6101 15.3663 13.931 15.2028C14.2132 15.059 14.4427 14.8295 14.5865 14.5472C14.75 14.2264 14.75 13.8063 14.75 12.9663V7.54006C14.75 7.10929 14.75 6.89391 14.6945 6.69556C14.6453 6.51986 14.5645 6.35461 14.456 6.20791C14.3335 6.04231 14.1635 5.91008 13.8235 5.64562L8.73673 1.68927C8.47324 1.48433 8.34149 1.38186 8.19601 1.34247C8.06765 1.30772 7.93235 1.30772 7.80399 1.34247C7.65851 1.38186 7.52677 1.48433 7.26327 1.68927Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
