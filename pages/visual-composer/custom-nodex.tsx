import React, { memo } from "react";

const PAGE_SIZE = 10;

function CustomNode({ id, data }) {
  return (
    <>
      <div className="custom-node__header">
        <strong>{data.label}</strong>
      </div>
    </>
  );
}

export default memo(CustomNode);
