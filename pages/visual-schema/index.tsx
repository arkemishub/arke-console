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

import { Layout } from "@/components/Layout";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Connection,
} from "reactflow";
import React, { useCallback, useEffect, useState } from "react";
import ArkeNode from "@/components/VisualSchema/ArkeNode";
import "reactflow/dist/style.css";
import RightClickMenuContext from "@/components/VisualSchema/RightClickMenuContext";
import useClient from "@/arke/useClient";
import { Client, TBaseParameter, TUnit } from "@arkejs/client";
import { Filter, Sort } from "@arkejs/table";
import { AddIcon, EditIcon } from "@/components/Icon";
import toast from "react-hot-toast";
import {
  ArkeCrud as ArkeEdit,
  ArkeCrud as ArkeAdd,
  ArkeDelete,
  AssignParameterDelete,
} from "@/crud/arke";
import { CrudState } from "@/types/crud";
import { GetServerSideProps } from "next";
import { withAuth } from "@/server/withAuth";
import NoDataNode from "@/components/VisualSchema/NoDataNode";

const PAGE_SIZE = 100;
const fetchArke = async (
  client: Client,
  page?: number,
  filters?: Filter[],
  sort?: Sort[]
) => {
  return client.arke.getAll({
    params: {
      filter:
        filters && filters?.length > 0
          ? `and(${filters.map(
              (f) => `${f.operator}(${f.columnId},${f.value})`
            )})`
          : null,
      offset: (page ?? 0) * PAGE_SIZE,
      limit: PAGE_SIZE,
      order: sort?.map((sort) => `${sort.columnId};${sort.type}`),
    },
  });
};

// defined outside component
const nodeTypes = {
  noData: NoDataNode,
  arke: ArkeNode,
};

function VisualSchema() {
  const client = useClient();
  const [activeArke, setActiveArke] = useState<TUnit>();
  const [arkeCrud, setArkeCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });
  const [activeParameter, setActiveParameter] = useState<TBaseParameter>();
  const [parametersCrud, setParametersCrud] = useState<CrudState>({
    add: false,
    edit: false,
    delete: false,
  });
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    fetchArke(client).then(async (res) => {
      if (res.data.content.items.length > 0) {
        const structPromises = res.data.content.items.map(
          async (item, index) => {
            const response = await client.arke.struct(item.id);
            return {
              id: item.id,
              type: "arke",
              position: { x: index * 200, y: 0 },
              data: {
                arke: item,
                parameters: response.data.content.parameters,
                onLoadData: loadData,
                onEditArke: (arke: TUnit) => {
                  setActiveArke(arke);
                  setArkeCrud((p) => ({ ...p, edit: true }));
                },
                onDeleteArke: (arke: TUnit) => {
                  setActiveArke(arke);
                  setArkeCrud((p) => ({ ...p, delete: true }));
                },
                onUnassignParameter: (
                  arke: TUnit,
                  parameter: TBaseParameter
                ) => {
                  setActiveArke(arke);
                  setActiveParameter(parameter);
                  setParametersCrud((prevState) => ({
                    ...prevState,
                    delete: true,
                  }));
                },
              },
            };
          }
        );
        Promise.all(structPromises).then((data) => setNodes(data));
      } else {
        setNodes([
          {
            id: "no_data",
            type: "noData",
            position: { x: 0, y: 0 },
            data: {},
          },
        ]);
      }
    });
  }

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  return (
    <Layout>
      <RightClickMenuContext
        onCreateArke={() => setArkeCrud((p) => ({ ...p, add: true }))}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // onInit={(reactFlowInstance) => }
          fitView
          attributionPosition="top-right"
          nodeTypes={nodeTypes}
        >
          <MiniMap
            style={{
              height: 120,
            }}
            zoomable
            pannable
          />
          <Controls />
          <Background
            id="1"
            gap={4}
            color="#1D1F29"
            variant={BackgroundVariant.Dots}
          />
        </ReactFlow>
      </RightClickMenuContext>

      <ArkeAdd
        title={
          <div className="flex items-center gap-4">
            <AddIcon className="text-primary" />
            Add Arke
          </div>
        }
        open={arkeCrud.add}
        onClose={() => setArkeCrud((p) => ({ ...p, add: false }))}
        onSubmit={(res) => {
          toast.success(`Arke ${res.data.content.id} created correctly`);
          loadData();
          setArkeCrud((p) => ({ ...p, add: false }));
        }}
      />

      {activeArke && (
        <>
          <ArkeEdit
            title={
              <div className="flex items-center gap-4">
                <EditIcon className="text-primary" />
                Edit Arke
              </div>
            }
            open={!!arkeCrud.edit}
            arkeId={activeArke.id}
            onClose={() => setArkeCrud((p) => ({ ...p, edit: false }))}
            onSubmit={(res) => {
              loadData();
              toast.success(`Arke ${res.data.content.id} edited correctly`);
              setArkeCrud((p) => ({ ...p, edit: false }));
            }}
          />

          <ArkeDelete
            open={!!arkeCrud.delete}
            onClose={() => setArkeCrud((p) => ({ ...p, delete: false }))}
            arkeId={activeArke.id}
            onDelete={() => {
              loadData();
              toast.success(`Arke deleted correctly`);
              setArkeCrud((p) => ({ ...p, delete: false }));
            }}
          />
        </>
      )}

      {activeArke && activeParameter && (
        <>
          <AssignParameterDelete
            parameter={activeParameter}
            onClose={() =>
              setParametersCrud((prevState) => ({
                ...prevState,
                delete: false,
              }))
            }
            arkeId={activeArke?.id}
            onDelete={() => {
              loadData();
              setParametersCrud((prevState) => ({
                ...prevState,
                delete: false,
              }));
            }}
            open={!!parametersCrud.delete}
          />
        </>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withAuth(() => {
  return {
    props: {},
  };
});

export default VisualSchema;
