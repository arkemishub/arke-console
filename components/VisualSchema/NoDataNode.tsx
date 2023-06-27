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

import React, { memo } from "react";
import { AddIcon } from "@/components/Icon";

interface NoDataNodeProps {
  data: {};
}
function NoDataNode(props: NoDataNodeProps) {
  const {} = props.data;

  return (
    <span className="mt-4 text-xl text-neutral-300">
      Use the Right Click to create your first Arke
    </span>
  );
}

export default memo(NoDataNode);
