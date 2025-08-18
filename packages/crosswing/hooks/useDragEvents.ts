import { DragEvent, useRef, useState } from "react";

export interface UseDragEventsOptions {
  onDragOverChange?: (isDraggingOver: boolean) => void;
  onDrop?: (e: DragEvent) => void;
}

export function useDragEvents(options: UseDragEventsOptions = {}) {
  const { onDragOverChange, onDrop: onDropCallback } = options;

  // https://stackoverflow.com/a/21002544/66673
  // We useRef instead of useState because we can't rely on state changes
  // firing render updates in time for the drag events.
  const overCountRef = useRef(0);

  // Keep our own internal state for our data attribute for quick styling.
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  function onDragEnter() {
    overCountRef.current++;
    onDragOverChange?.(true);
    setIsDraggingOver(true);
  }

  function onDragLeave() {
    overCountRef.current--;
    const isDraggingOver = overCountRef.current > 0;
    onDragOverChange?.(isDraggingOver);
    setIsDraggingOver(isDraggingOver);
  }

  function onDrop(e: DragEvent) {
    overCountRef.current = 0;
    onDragOverChange?.(false);
    setIsDraggingOver(false);
    onDropCallback?.(e);
  }

  // Prevent default behavior for dragover to allow drop
  function onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  return {
    onDragEnter,
    onDragLeave,
    onDrop,
    onDragOver,
    "data-dragging-over": isDraggingOver,
  };
}
