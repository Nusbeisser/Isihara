import { Jimp } from "jimp";
import { Buffer } from "buffer";

// export default async function calculateChannelSaturation(
//   imagePath: string,
//   channel = "red"
// ) {
//   const image = await Jimp.read(dataUrlToBuffer(imagePath));

//   let totalSaturation = 0;
//   let pixelCount = 0;

//   image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
//     const r = image.bitmap.data[idx]; // Kanał czerwony
//     const g = image.bitmap.data[idx + 1]; // Kanał zielony
//     const b = image.bitmap.data[idx + 2]; // Kanał niebieski

//     let selectedChannelValue, otherChannelsSum;

//     switch (channel.toLowerCase()) {
//       case "red":
//         selectedChannelValue = r;
//         otherChannelsSum = g + b;
//         break;
//       case "green":
//         selectedChannelValue = g;
//         otherChannelsSum = r + b;
//         break;
//       case "blue":
//         selectedChannelValue = b;
//         otherChannelsSum = r + g;
//         break;
//       default:
//         throw new Error(
//           "Niepoprawny kanał! Wybierz 'red', 'green' lub 'blue'."
//         );
//     }
//     // Oblicz nasycenie dla wybranego kanału
//     const saturation =
//       selectedChannelValue / (selectedChannelValue + otherChannelsSum || 1); // Unikamy dzielenia przez 0
//     totalSaturation += saturation;
//     pixelCount++;
//   });
//   return totalSaturation / pixelCount; // Średnie nasycenie wybranego kanału
// }

// const dataUrlToBuffer = (dataUrl: string) => {
//   const base64Data = dataUrl.split(",")[1]; // Usuń prefiks "data:image/png;base64,"
//   return Buffer.from(base64Data, "base64");
// };

// export async function analyzeRGBComponents(imagePath: string) {
//   try {
//     console.log(imagePath);
//     const image = await Jimp.read(imagePath);
//     let totalRed = 0,
//       totalGreen = 0,
//       totalBlue = 0;
//     let minRed = 255,
//       minGreen = 255,
//       minBlue = 255;
//     let maxRed = 0,
//       maxGreen = 0,
//       maxBlue = 0;
//     const pixelCount = image.bitmap.width * image.bitmap.height;

//     // Iteracja po pikselach
//     image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
//       const r = image.bitmap.data[idx]; // Kanał czerwony
//       const g = image.bitmap.data[idx + 1]; // Kanał zielony
//       const b = image.bitmap.data[idx + 2]; // Kanał niebieski

//       // Sumowanie wartości
//       totalRed += r;
//       totalGreen += g;
//       totalBlue += b;

//       // Minimalne i maksymalne wartości
//       minRed = Math.min(minRed, r);
//       minGreen = Math.min(minGreen, g);
//       minBlue = Math.min(minBlue, b);

//       maxRed = Math.max(maxRed, r);
//       maxGreen = Math.max(maxGreen, g);
//       maxBlue = Math.max(maxBlue, b);
//     });

//     // Obliczenie średnich
//     const avgRed = totalRed / pixelCount;
//     const avgGreen = totalGreen / pixelCount;
//     const avgBlue = totalBlue / pixelCount;

//     // Wynik analizy
//     console.log("Statystyki RGB:");
//     console.log(
//       `Red   -> Średnia: ${avgRed.toFixed(2)}, Min: ${minRed}, Max: ${maxRed}`
//     );
//     console.log(
//       `Green -> Średnia: ${avgGreen.toFixed(
//         2
//       )}, Min: ${minGreen}, Max: ${maxGreen}`
//     );
//     console.log(
//       `Blue  -> Średnia: ${avgBlue.toFixed(
//         2
//       )}, Min: ${minBlue}, Max: ${maxBlue}`
//     );
//   } catch (err) {
//     console.error("Błąd:", err);
//   }
// }

export async function analyzeRGBComponentsFromCanvas(
  canvas: HTMLCanvasElement
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
  };
}
