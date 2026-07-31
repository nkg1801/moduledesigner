import { useEffect } from "react";
import { useEditorStore } from "../store/editorStore";

export default function useDeleteKey() {
  const deleteSelectedShape =
    useEditorStore(
      (state) =>
        state.deleteSelectedShape
    );

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Delete") {
        deleteSelectedShape();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [deleteSelectedShape]);
}