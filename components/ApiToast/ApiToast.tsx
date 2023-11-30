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
