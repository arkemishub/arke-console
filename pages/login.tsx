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

import { GetServerSideProps } from "next";
import { withLoggedInRedirect } from "@/server/withLoggedInRedirect";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button, Input, Spinner } from "@arkejs/ui";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import {
  UserCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import InputPassword from "@/components/InputPassword/InputPassword";

export default function Login({ csrfToken }: { csrfToken: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { query } = useRouter();

  useEffect(() => {
    if (query.error)
      toast.error("Incorrect username and/or password", {
        id: "error_login",
      });
  }, [query]);

  function onSignIn(e: any) {
    e.preventDefault();
    setLoading(true);
    void signIn("credentials", {
      callbackUrl: `${window.location.origin}/`,
      username: username,
      password: password,
    });
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form onSubmit={onSignIn} className="m-auto grid w-[400px] gap-4">
        <Image
          src={"/arke_logo.svg"}
          alt="logo"
          height={40}
          width={120}
          className="m-auto mb-4"
        />
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <Input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          startAdornment={
            <UserCircleIcon className="h-5 w-5 stroke-white/50" />
          }
          fullWidth
        />
        <InputPassword
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button color="primary" type="submit">
          {loading ? (
            <Spinner className="h-5 w-5" />
          ) : (
            <>
              <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5 stroke-black" />
              Login
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withLoggedInRedirect(
  async (context) => {
    const providers = await getProviders();
    return {
      props: {
        csrfToken: await getCsrfToken(context),
        providers,
      },
    };
  }
);
