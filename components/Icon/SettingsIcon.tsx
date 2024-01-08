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

export function SettingsIcon({ className }: { className?: string }) {
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
        d="M2 5.33301L10 5.33301M10 5.33301C10 6.43758 10.8954 7.33301 12 7.33301C13.1046 7.33301 14 6.43758 14 5.33301C14 4.22844 13.1046 3.33301 12 3.33301C10.8954 3.33301 10 4.22844 10 5.33301ZM6 10.6663L14 10.6663M6 10.6663C6 11.7709 5.10457 12.6663 4 12.6663C2.89543 12.6663 2 11.7709 2 10.6663C2 9.56177 2.89543 8.66634 4 8.66634C5.10457 8.66634 6 9.56177 6 10.6663Z"
        stroke="#797D94"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
