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

import { render } from "@testing-library/react";
import { ProjectSidebar } from "@/components/Sidebar/ProjectSidebar/index";

const useRouter = jest.spyOn(require("next/router"), "useRouter");

describe("ProjectSidebar", () => {
  test("should render", () => {
    useRouter.mockImplementationOnce(() => ({
      query: { project: "test-project" },
    }));
    const { getByText } = render(<ProjectSidebar />);
    expect(getByText("Return to Dashboard")).toBeInTheDocument();
    expect(getByText("Arke")).toBeInTheDocument();
    expect(getByText("Parameters")).toBeInTheDocument();
    expect(getByText("Members")).toBeInTheDocument();
    expect(getByText("Logout")).toBeInTheDocument();
  });
});
