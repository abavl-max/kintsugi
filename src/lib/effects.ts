export function applyPixelate(imageData: ImageData, { blockSize }: { blockSize: number }): ImageData {
  const { data, width, height } = imageData;
  const size = Math.max(1, Math.floor(blockSize));
  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      for (let nY = 0; nY < size; nY++) {
        for (let nX = 0; nX < size; nX++) {
          if (x + nX < width && y + nY < height) {
            const j = ((y + nY) * width + (x + nX)) * 4;
            data[j] = r;
            data[j + 1] = g;
            data[j + 2] = b;
            data[j + 3] = a;
          }
        }
      }
    }
  }
  return imageData;
}
export function applyRgbShift(imageData: ImageData, { offset }: { offset: number }): ImageData {
  const { data, width, height } = imageData;
  const copy = new Uint8ClampedArray(data);
  const shift = Math.floor(offset);
  for (let i = 0; i < data.length; i += 4) {
    // Red channel
    if (i - shift * 4 >= 0) {
      data[i] = copy[i - shift * 4];
    }
    // Green channel - stays
    // Blue channel
    if (i + shift * 4 < data.length) {
      data[i + 2] = copy[i + shift * 4];
    }
  }
  return imageData;
}
export function applyNoise(imageData: ImageData, { amount }: { amount: number }): ImageData {
  const { data } = imageData;
  const intensity = Math.floor(amount);
  for (let i = 0; i < data.length; i += 4) {
    const random = (Math.random() - 0.5) * intensity;
    data[i] = data[i] + random;
    data[i + 1] = data[i + 1] + random;
    data[i + 2] = data[i + 2] + random;
  }
  return imageData;
}