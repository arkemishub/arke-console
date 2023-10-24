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

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { formatBytes } from "@/utils/file";
interface DropzoneProps {
  value?: string;
  label?: string;
  onChange?(files: File[]): void;
}

interface AcceptedFile extends File {
  path?: string;
}

const maxSize = 5243000; // 5Mb as bytes
export default function Dropzone(props: DropzoneProps) {
  const { value, label, onChange } = props;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize,
    onDrop: (acceptedFiles, fileRejections) => {
      setSelectedFiles([...selectedFiles, ...acceptedFiles]);
      onChange?.([...selectedFiles, ...acceptedFiles]);
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === "file-too-large") {
            toast.error(`${err.message}`);
          }

          if (err.code === "file-invalid-type") {
            toast.error(`${err.message}`);
          }
        });
      });
    },
  });

  const removeFile = (file: File) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setSelectedFiles(newFiles);
    onChange?.(newFiles);
  };

  const removeAll = () => {
    setSelectedFiles([]);
    onChange?.([]);
  };

  const File = (file: { path?: string; size: number }) => (
    <li className="flex gap-2 text-xs" key={file.path}>
      <XMarkIcon
        className="w-4 cursor-pointer text-error"
        onClick={() => removeFile(file as File)}
      />
      {file.path} - {formatBytes(file.size)}
    </li>
  );

  return (
    <>
      {label}
      {selectedFiles.length === 0 && !value && (
        <section>
          <div
            {...getRootProps({ className: "dropzone" })}
            className="min-h-20 flex cursor-pointer flex-col items-center justify-center
           gap-1 rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.2)] p-12 text-center duration-75
           hover:border-primary"
          >
            <input {...getInputProps()} />
            <ArrowUpTrayIcon className="h-5 w-5" />
            <p className="font-semibold">Upload file</p>
            <p className="text-xs">{formatBytes(maxSize)} max. file size</p>
          </div>
        </section>
      )}
      <aside className="grid gap-2">
        {selectedFiles.length > 0 ? (
          <ul>
            {acceptedFiles.map((file: AcceptedFile, index) => (
              <File key={index} path={file.path} size={file.size} />
            ))}
          </ul>
        ) : (
          value && (
            <ul>
              {/*// TODO: check value of backend with load_images */}
              <File path={value.path} size={1000000} />
            </ul>
          )
        )}
      </aside>
    </>
  );
}
