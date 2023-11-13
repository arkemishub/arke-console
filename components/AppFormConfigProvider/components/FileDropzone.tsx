/*
 * Copyright 2023 Arkemis S.r.l.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useState } from "react";
import useClient from "@/arke/useClient";
import Dropzone from "@/components/Dropzone/Dropzone";
import { LinkRef } from "@/types/link";
import { TFile } from "@/types/file";

type FileDropzoneProps = {
  link_ref: LinkRef;
  onChange: (value: any) => void;
  value: TFile;
};

const FileDropzone = (props: FileDropzoneProps) => {
  const { onChange } = props;
  const client = useClient();
  const [value, setValue] = useState<TFile>(props.value);

  useEffect(() => {
    if (value) {
      client.unit
        // @ts-ignore
        // TODO: check value that change
        .get("arke_file", value)
        .then((res) => {
          setValue(res.data.content as TFile);
          onChange(res.data.content.id);
        });
    }
  }, []);

  return (
    <Dropzone
      {...props}
      value={value}
      onChange={(files) => {
        onChange(files?.[0] ?? null);
      }}
    />
  );
};

export default FileDropzone;
