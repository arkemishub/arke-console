import { Layout } from "@/components/Layout";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "reactflow";
import { useCallback, useEffect, useState } from "react";
import ArkeNode from "@/pages/visual-composer/ArkeNode";
import {
  nodes as initialNodes,
  edges as initialEdges,
} from "./initial-elements";
import "reactflow/dist/style.css";
import RightClickMenuContext from "@/pages/visual-composer/RightClickMenuContext";
import useClient from "@/arke/useClient";
import { Client, TBaseParameter } from "@arkejs/client";
import { Filter, Sort } from "@arkejs/table";
import { AddIcon } from "@/components/Icon";
import toast from "react-hot-toast";
import { ArkeCrud as ArkeAdd } from "@/crud/arke";

const PAGE_SIZE = 10;
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

// defined outside of the component
const nodeTypes = {
  arke: ArkeNode,
};

export default function Index() {
  const client = useClient();
  const [crud, setCrud] = useState<{
    add: boolean;
    edit: TBaseParameter | false;
    delete: TBaseParameter | false;
  }>({
    add: false,
    edit: false,
    delete: false,
  });
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    updateData();
  }, []);

  function updateData() {
    fetchArke(client).then(async (res) => {
      const structPromises = res.data.content.items.map(async (item, index) => {
        const response = await client.arke.struct(item.id);
        return {
          id: item.id,
          type: "arke",
          position: { x: index * 200, y: 200 },
          data: {
            arke: item,
            parameters: response.data.content.parameters,
            onUpdateData: updateData,
          },
        };
      });
      Promise.all(structPromises).then((data) => setNodes(data));
    });
  }

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  const edgesWithUpdatedTypes = edges.map((edge) => {
    if (edge.sourceHandle) {
      const edgeType = nodes.find((node) => node.type === "arke").data.selects[
        edge.sourceHandle
      ];
      edge.type = edgeType;
    }

    return edge;
  });

  return (
    <Layout>
      <RightClickMenuContext
        onCreateArke={() => setCrud((p) => ({ ...p, add: true }))}
      >
        <ReactFlow
          nodes={nodes}
          edges={edgesWithUpdatedTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={(reactFlowInstance) =>
            console.log("flow loaded:", reactFlowInstance)
          }
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
        open={crud.add}
        onClose={() => setCrud((p) => ({ ...p, add: false }))}
        onSubmit={(res) => {
          toast.success(`Arke ${res.data.content.id} created correctly`);
          updateData();
          setCrud((p) => ({ ...p, add: false }));
        }}
      />
    </Layout>
  );
}
