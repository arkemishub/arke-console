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

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@arkejs/ui";

function Pagination({
  currentPage = 0,
  pageCount = 0,
  onChange,
  totalCount = 0,
}: {
  currentPage?: number;
  pageCount?: number;
  onChange?: (page: number) => void;
  totalCount: number;
}) {
  return (
    <div className="absolute mt-auto flex w-full justify-between px-2 pt-4">
      {totalCount ? <p className="text-sm">Total: {totalCount}</p> : null}

      <div className="ml-auto flex">
        <Button
          disabled={pageCount === 1 || currentPage === 0}
          onClick={() => onChange?.(0)}
        >
          <ChevronDoubleLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={pageCount === 1 || currentPage === 0}
          onClick={() => onChange?.(currentPage - 1)}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={pageCount === 1 || currentPage === pageCount - 1}
          onClick={() => onChange?.(currentPage + 1)}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          disabled={pageCount === 1 || currentPage === pageCount - 1}
          onClick={() => onChange?.(pageCount - 1)}
        >
          <ChevronDoubleRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
