import { Line } from "react-konva";

import { useEditorStore } from "../store/editorStore";

export default function ConnectionLayer() {
    const connections =
        useEditorStore((state) => {

            const currentHmi =
                state.hmis.find(
                    (hmi) =>
                        hmi.id ===
                        state.selectedHmiId
                );

            return (
                currentHmi?.connections ?? []
            );
        });

  const shapes =
    useEditorStore(
      (state) => state.shapes
        );

    const selectedConnectionId =
        useEditorStore(
            (state) =>
                state.selectedConnectionId
        );

    const selectConnection =
        useEditorStore(
            (state) =>
                state.selectConnection
        );

  return (
    <>
      {connections.map(
        (connection) => {
              const source =
                  shapes.find(
                      (s) =>
                          s.id ===
                          connection.sourceShapeId
                  );

              const target =
                  shapes.find(
                      (s) =>
                          s.id ===
                          connection.targetShapeId
                  );

              if (
                  !source ||
                  !target
              ) {
                  return null;
              }

              const sourcePort =
                  source.ports?.find(
                      (p) =>
                          p.id ===
                          connection.sourcePortId
                  );

              const targetPort =
                  target.ports?.find(
                      (p) =>
                          p.id ===
                          connection.targetPortId
                  );

              if (
                  !sourcePort ||
                  !targetPort
              ) {
                  return null;
              }

              const sourceX =
                  source.x +
                  sourcePort.offsetX;

              const sourceY =
                  source.y +
                  sourcePort.offsetY;

              const targetX =
                  target.x +
                  targetPort.offsetX;

              const targetY =
                  target.y +
                  targetPort.offsetY;

          return (
              <Line
                  key={connection.id}
                  points={[
                      sourceX,
                      sourceY,
                      targetX,
                      targetY,
                  ]}
                  stroke={
                      selectedConnectionId ===
                          connection.id
                          ? "blue"
                          : "black"
                  }
                  strokeWidth={
                      selectedConnectionId ===
                          connection.id
                          ? 4
                          : 2
                  }
                  onClick={() =>
                      selectConnection(
                          connection.id
                      )
                  }
              />
          );
        }
      )}
    </>
  );
}