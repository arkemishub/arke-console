import { ReactNode } from "react";
import { TableConfigProvider } from "@arkejs/table";
import { isImage } from "@/utils/file";

const AppTableConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TableConfigProvider
      components={{
        string: (value) => <p>{value?.label ?? value}</p>,
        // TODO: we have to extend table with link
        // @ts-ignore
        link: (value) => (
          <>
            {value.arke_id === "arke_file" && (
              <a href={value?.signed_url} target="_blank">
                {isImage(value.extension) && (
                  <div className="flex items-center gap-4">
                    <img
                      alt={value.id}
                      src={value?.signed_url}
                      className="h-12 rounded"
                    />
                    {value?.name}
                  </div>
                )}
              </a>
            )}
          </>
        ),
      }}
    >
      {children}
    </TableConfigProvider>
  );
};

export default AppTableConfigProvider;
