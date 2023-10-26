import { useEffect } from "react";
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
  const { value, onChange } = props;
  const client = useClient();

  useEffect(() => {
    if (value) {
      client.unit
        // @ts-ignore
        // TODO: check value that change
        .get("arke_file", value)
        .then((res) => onChange(res.data.content));
    }
  }, []);

  return (
    <Dropzone
      {...props}
      onChange={(files) => {
        onChange(files?.[0] ?? null);
      }}
    />
  );
};

export default FileDropzone;
