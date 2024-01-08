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

export function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2.66668 14.5446C3.0684 14.6663 3.61099 14.6663 4.53333 14.6663H11.4667C12.389 14.6663 12.9316 14.6663 13.3333 14.5446M2.66668 14.5446C2.58054 14.5185 2.50088 14.4868 2.42535 14.4484C2.04902 14.2566 1.74306 13.9506 1.55132 13.5743C1.33333 13.1465 1.33333 12.5864 1.33333 11.4663V4.53301C1.33333 3.4129 1.33333 2.85285 1.55132 2.42503C1.74306 2.0487 2.04902 1.74274 2.42535 1.55099C2.85317 1.33301 3.41322 1.33301 4.53333 1.33301H11.4667C12.5868 1.33301 13.1468 1.33301 13.5746 1.55099C13.951 1.74274 14.2569 2.0487 14.4487 2.42503C14.6667 2.85285 14.6667 3.4129 14.6667 4.53301V11.4663C14.6667 12.5864 14.6667 13.1465 14.4487 13.5743C14.2569 13.9506 13.951 14.2566 13.5746 14.4484C13.4991 14.4868 13.4194 14.5185 13.3333 14.5446M2.66668 14.5446C2.6669 14.0051 2.67013 13.7196 2.7179 13.4794C2.92832 12.4216 3.75525 11.5947 4.81309 11.3842C5.07068 11.333 5.38045 11.333 6 11.333H10C10.6195 11.333 10.9293 11.333 11.1869 11.3842C12.2447 11.5947 13.0717 12.4216 13.2821 13.4794C13.3299 13.7196 13.3331 14.0051 13.3333 14.5446M10.6667 6.33301C10.6667 7.80577 9.47275 8.99967 8 8.99967C6.52724 8.99967 5.33333 7.80577 5.33333 6.33301C5.33333 4.86025 6.52724 3.66634 8 3.66634C9.47275 3.66634 10.6667 4.86025 10.6667 6.33301Z"
        stroke="#797D94"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
