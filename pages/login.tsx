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
import { useState } from "react";
import { Button, Input, Spinner } from "@arkejs/ui";

export default function Login({ csrfToken }: { csrfToken: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="h-screen w-screen">
      <form
        onSubmit={onSignIn}
        className="m-auto grid w-[400px] gap-4 pt-[20%]"
      >
        <h1>Login</h1>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <br />
        <Input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          fullWidth
        />
        <Input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          fullWidth
        />
        <Button color="primary" type="submit">
          {loading ? <Spinner /> : "Login"}
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
