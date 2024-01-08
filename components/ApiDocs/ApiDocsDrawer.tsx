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

import { Drawer, Tabs } from "@arkejs/ui";
import { Table } from "@arkejs/table";
import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.js";
import arkeDocs from "@/components/ApiDocs/arke";
import { useRouter } from "next/router";
import { Doc } from "@/types/docs";

const languageLabels = {
  javascript: "JavaScript",
};

const docs = {
  arke: arkeDocs,
};

const formatCode = () => {
  Prism.highlightAll();
  Prism.plugins.NormalizeWhitespace.setDefaults({
    "remove-trailing": true,
    "remove-indent": true,
    "left-trim": true,
    "right-trim": true,
  });
};

function DocsTabContent({ doc }: { doc: Doc }) {
  useEffect(() => {
    formatCode();
  }, []);
  return (
    <div className="api__docs__content">
      <h3 className="text-xl">{doc.title}</h3>
      <p className="pb-4 pt-2">{doc.description}</p>
      <Tabs>
        {doc.code.map(({ language }, index) => (
          <Tabs.Tab key={index}>
            {languageLabels[language as keyof typeof languageLabels]}
          </Tabs.Tab>
        ))}
        {doc.code.map(({ code }, index) => (
          <Tabs.TabPanel key={index}>
            <div>
              <pre>
                <code className="language-javascript">{code}</code>
              </pre>
            </div>
          </Tabs.TabPanel>
        ))}
      </Tabs>
      {doc.tables.map((table, index) => (
        <div key={index} className="mt-8">
          <h4>{table.title}</h4>
          <Table columns={table.columns} data={table.rows} />
        </div>
      ))}
    </div>
  );
}

function ApiDocsDrawer({
  open,
  onClose,
  kind,
}: {
  kind: "arke";
  open: boolean;
  onClose: () => void;
}) {
  const { query } = useRouter();
  const activeDoc = docs[kind]({ arkeId: (query.arkeId as string) ?? "" });

  return (
    <Drawer
      title="API Docs"
      position="right"
      className="max-w-[70vw]"
      open={open}
      onClose={onClose}
    >
      <div className="api__docs">
        <Tabs>
          {Object.keys(activeDoc).map((key, index) => (
            <Tabs.Tab key={index}>{key}</Tabs.Tab>
          ))}
          {Object.keys(activeDoc).map((key, index) => {
            const doc: Doc = activeDoc?.[key as keyof typeof activeDoc];
            return doc ? (
              <Tabs.TabPanel key={index}>
                <DocsTabContent doc={doc} />
              </Tabs.TabPanel>
            ) : null;
          })}
        </Tabs>
      </div>
    </Drawer>
  );
}

export default ApiDocsDrawer;
