import {
  ChangeEvent,
  HTMLAttributes,
  ReactNode,
  useRef,
  useState,
} from "react";
import { styled } from "styled-components";

export function FileInput({
  accept,
  onDragOverChange,
  onFileSelect,
  onFileListSelect,
  multiple,
  disabled,
  children,
  ...rest
}: {
  accept?: string;
  onDragOverChange?: (over: boolean) => void;
  onFileSelect?: (file: File) => void;
  onFileListSelect?: (list: FileList) => void;
  multiple?: boolean;
  disabled?: boolean;
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
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

  function onDrop() {
    overCountRef.current = 0;
    onDragOverChange?.(false);
    setIsDraggingOver(false);
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target;

    if (multiple) {
      const files = input.files;
      if (!files) return;

      onFileListSelect?.(files);
    } else {
      const file = input.files?.[0];
      if (!file) return;

      onFileSelect?.(file);
    }

    // Clear the input in case you want to select the exact same file again.
    input.value = ""; // clears the "files" property.
  }

  return (
    <StyledFileInput
      data-disabled={disabled}
      data-dragging-over={isDraggingOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      {...rest}
    >
      {children}
      <input
        type="file"
        size={0}
        onChange={onFileChange}
        multiple={multiple}
        accept={accept}
        // Hides the "No files chosen" tooltip in Chrome.
        title=""
      />
    </StyledFileInput>
  );
}

export const StyledFileInput = styled.div`
  position: relative;

  > input[type="file"] {
    appearance: none;
    opacity: 0; /* Necessary for older iOS versions. */
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    cursor: pointer;
    color: transparent;
    /* Necessary to hide the tooltip in Safari. But it breaks the input! */
    /* visibility: hidden; */
  }

  &[data-dragging-over="true"] {
    > input[type="file"] {
      /* Must make it visible again to accept drops. */
      visibility: visible;
    }
  }

  > input[type="file"]::-webkit-file-upload-button,
  > input[type="file"]::file-selector-button {
    display: none;
  }

  &[data-disabled="true"] {
    > input[type="file"] {
      pointer-events: none;
    }
  }
`;
