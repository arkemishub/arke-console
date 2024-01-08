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

import { ReactNode, useEffect } from "react";
import { HTTPStatusCode } from "@arkejs/client";
import toast from "react-hot-toast";

export default function ApiToast({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.addEventListener("arke_client_reject", onReject, false);
  }, []);

  function onReject(event: any) {
    const err = event.detail;
    try {
      if (err.response) {
        if (err.response.status === HTTPStatusCode.Forbidden) {
          toast.error(
            `You have not access on resource. Check your permissions`,
            {
              id: "permission_error",
            }
          );
        }
        if (err.response.status === HTTPStatusCode.InternalServerError) {
          toast.error(`${err.message}: ${err.response.data?.errors?.detail}`);
        }
        return Promise.reject(err);
      } else {
        toast.error(`Something went wrong. The Server is unreachable.`);
        return Promise.reject(err);
      }
    } catch (e) {
      return Promise.reject(err);
    }
  }

  return <div>{children}</div>;
}
