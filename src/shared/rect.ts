export interface Rect {
  width: number;
  height: number;
}

/** Helpful utility method. */
export function scaleToFit(
  size: Rect,
  targetSize: Rect,
  { enlarge = false }: { enlarge?: boolean } = {},
): Rect {
  const aspect = size.width / size.height;
  const targetAspect = targetSize.width / targetSize.height;

  let finalSize: Rect;

  // This makes sense when you draw out some samples on graph paper.
  if (aspect > targetAspect) {
    finalSize = { width: targetSize.width, height: targetSize.width / aspect };
  } else {
    finalSize = {
      width: targetSize.height * aspect,
      height: targetSize.height,
    };
  }

  if (
    !enlarge &&
    (finalSize.width > size.width || finalSize.height > size.height)
  ) {
    return size;
  }

  return finalSize;
}
