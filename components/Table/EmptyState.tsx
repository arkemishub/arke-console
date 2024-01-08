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

import { AddIcon } from "@/components/Icon";
import { Button } from "@arkejs/ui";

const EmptyState = ({
  name,
  onCreate,
}: {
  name?: string;
  onCreate?(): void;
}) => {
  return (
    <div className="flex flex-col items-center p-4 py-8 text-center">
      <div className="rounded-full bg-background-400 p-6">
        <AddIcon className="h-12 w-12 text-primary" />
      </div>
      <span className="mt-4 text-xl">
        Create your first {name} to get started.
      </span>
      <div className="mt-4 flex">
        <Button className="border" onClick={onCreate}>
          Add {name}
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
