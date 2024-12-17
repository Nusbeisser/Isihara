export async function analyzeRGBComponentsFromCanvas(
  canvas: HTMLCanvasElement,
  spacePressed: boolean
) {
  let totalRed = 0,
    totalGreen = 0,
    totalBlue = 0;
  let minRed = 255,
    minGreen = 255,
    minBlue = 255;
  let maxRed = 0,
    maxGreen = 0,
    maxBlue = 0;
  let avgRed, avgGreen, avgBlue;
  try {
    const context = canvas.getContext("2d");

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    const pixelCount = width * height;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      totalRed += r;
      totalGreen += g;
      totalBlue += b;

      minRed = Math.min(minRed, r);
      minGreen = Math.min(minGreen, g);
      minBlue = Math.min(minBlue, b);

      maxRed = Math.max(maxRed, r);
      maxGreen = Math.max(maxGreen, g);
      maxBlue = Math.max(maxBlue, b);
    }

    avgRed = totalRed / pixelCount;
    avgGreen = totalGreen / pixelCount;
    avgBlue = totalBlue / pixelCount;
  } catch (err) {
    console.error("Błąd:", err);
  }
  return {
    red: { avg: avgRed, max: maxRed },
    green: { avg: avgGreen, max: maxGreen },
    blue: { avg: avgBlue, max: maxBlue },
    spacePressed: spacePressed,
  };
}
