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

import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import Image from "next/image";

export default function Logout() {
  useEffect(() => {
    deleteCookie("arke_project");
    void signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <Image src="/arke_logo.svg" alt="logo" height={60} width={140} />
      You are being logged out...
    </div>
  );
}
