import React from "react";
import { MarkerType, Position } from "reactflow";

export const nodes = [
  {
    id: "1",
    type: "custom",
    position: { x: 100, y: 200 },
    data: {},
  },
];

export const edges = [
  { id: "e1-2", source: "1", target: "2", label: "this is an edge label" },
];
