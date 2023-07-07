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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M10 19.9999V15.9999C10 15.4477 10.4477 14.9999 11 14.9999H13C13.5523 14.9999 14 15.4477 14 15.9999V19.9999M11.3356 4.59048L5.67127 9.62547C5.2443 10.005 5 10.549 5 11.1203V17.9999C5 19.1045 5.89543 19.9999 7 19.9999H17C18.1046 19.9999 19 19.1045 19 17.9999V11.1203C19 10.549 18.7557 10.005 18.3287 9.62547L12.6644 4.59048C12.2855 4.25369 11.7145 4.25369 11.3356 4.59048Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
