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

export function SupportIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="120"
      height="201"
      viewBox="0 0 120 201"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.1"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0.117188C27.6142 0.117188 50 22.5029 50 50.1172C22.3858 50.1172 0 27.7315 0 0.117188ZM100 0.117188C72.3858 0.117188 50 22.5029 50 50.1172C22.3858 50.1172 0 72.5029 0 100.117C0 127.731 22.3858 150.117 50 150.117C22.3858 150.117 0 172.503 0 200.117C27.6142 200.117 50 177.731 50 150.117C50 177.731 72.3858 200.117 100 200.117C127.614 200.117 150 177.731 150 150.117C150 177.731 172.386 200.117 200 200.117C200 172.503 177.614 150.117 150 150.117C177.614 150.117 200 127.731 200 100.117C200 72.5029 177.614 50.1172 150 50.1172C177.614 50.1172 200 27.7315 200 0.117188C172.386 0.117188 150 22.5029 150 50.1172C150 22.5029 127.614 0.117188 100 0.117188ZM150 150.117C150 122.503 127.614 100.117 100 100.117C100 127.731 122.386 150.117 150 150.117ZM100 100.117C127.614 100.117 150 77.7315 150 50.1172C150 77.7315 172.386 100.117 200 100.117C172.386 100.117 150 122.503 150 150.117C122.386 150.117 100 172.503 100 200.117C100 172.503 77.6142 150.117 50 150.117C77.6142 150.117 100 127.731 100 100.117ZM100 100.117C72.3858 100.117 50 122.503 50 150.117C50 122.503 27.6142 100.117 0 100.117C27.6142 100.117 50 77.7315 50 50.1172C50 77.7315 72.3858 100.117 100 100.117ZM100 100.117C100 72.5029 122.386 50.1172 150 50.1172C122.386 50.1172 100 27.7315 100 0.117188C100 27.7315 77.6142 50.1172 50 50.1172C77.6142 50.1172 100 72.5029 100 100.117Z"
        fill="url(#paint0_linear_558_9129)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_558_9129"
          x1="16.3934"
          y1="0.117195"
          x2="200"
          y2="200.117"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FAEAAF" />
          <stop offset="0.67229" stopColor="#FFA98E" />
          <stop offset="1" stopColor="#FF7067" />
        </linearGradient>
      </defs>
    </svg>
  );
}
