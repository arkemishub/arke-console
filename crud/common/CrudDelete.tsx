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

import React, { ReactNode } from "react";
import useClient from "@/arke/useClient";
import { Button, Dialog } from "@arkejs/ui";

export interface DeleteProps {
  unitId?: string;
  arkeId: string;
  open: string | boolean | undefined;
  title: ReactNode;
  onClose(): void;
  onBeforeSubmit?(): Promise<any>;
  onSubmit(data: any): void;
}

function CrudDelete(props: DeleteProps) {
  const client = useClient();
  const { arkeId, unitId, open, title, onClose, onBeforeSubmit, onSubmit } =
    props;

  function onDelete() {
    function onSubmitCallback() {
      let promise;

      if (unitId) {
        promise = client.unit.delete(arkeId, unitId as string);
      } else {
        promise = client.arke.delete(arkeId);
      }

      promise.then((res) => {
        onSubmit(res);
      });
    }

    if (onBeforeSubmit) {
      onBeforeSubmit().then(onSubmitCallback);
    } else {
      onSubmitCallback();
    }
  }

  return (
    <Dialog open={!!open} title={title} onClose={onClose}>
      <p className="text-sm">Do you really want to delete?</p>
      <div className="mt-4 flex gap-4">
        <Button className="w-full bg-neutral" onClick={onClose}>
          Cancel
        </Button>
        <Button className="w-full bg-error" onClick={onDelete}>
          Confirm
        </Button>
      </div>
    </Dialog>
  );
}

export { CrudDelete };
