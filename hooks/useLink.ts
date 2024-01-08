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

import useClient from "@/arke/useClient";

export function useLink(
  arkeParent: string,
  unitParent: string,
  arkeChild: string,
  callback?: () => void
) {
  const client = useClient();
  function onLink(unitChild: string) {
    return client.unit.topology
      .addLink({ arkeId: arkeParent, id: unitParent }, "link", {
        arkeId: arkeChild,
        id: unitChild,
      })
      .then(callback)
      .catch((err: string) => console.error(err));
  }
  return { onLink };
}

export function useUnlink(
  arkeParent: string,
  unitParent: string,
  arkeChild: string,
  callback?: () => void
) {
  const client = useClient();
  function onUnlink(unitChild: string) {
    return client.unit.topology
      .deleteLink({ arkeId: arkeParent, id: unitParent }, "link", {
        arkeId: arkeChild,
        id: unitChild,
      })
      .then(callback)
      .catch((err: string) => console.error(err));
  }
  return { onUnlink };
}
