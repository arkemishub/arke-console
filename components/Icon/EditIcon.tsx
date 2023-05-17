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

export function EditIcon({ className }: { className?: string }) {
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
        d="M18 10.0003L14 6.0003M2.5 21.5003L5.88437 21.1243C6.29786 21.0783 6.5046 21.0553 6.69785 20.9928C6.86929 20.9373 7.03245 20.8589 7.18289 20.7597C7.35245 20.6479 7.49955 20.5008 7.79373 20.2066L21 7.0003C22.1046 5.89573 22.1046 4.10487 21 3.0003C19.8955 1.89573 18.1046 1.89573 17 3.0003L3.79373 16.2066C3.49955 16.5008 3.35246 16.6478 3.24064 16.8174C3.14143 16.9679 3.06301 17.131 3.00751 17.3025C2.94496 17.4957 2.92198 17.7024 2.87604 18.1159L2.5 21.5003Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
