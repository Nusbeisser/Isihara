import { Jimp } from "jimp";

async function modifyRedChannel(
  imagePath: string,
  outputPath: string,
  redValueModifier: number
) {
  const image = await Jimp.read(imagePath);
  const canvas = document.getElementById("outCanvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    (x: any, y: any, idx: number) => {
      // idx to indeks piksela w buforze
      const red = image.bitmap.data[idx]; // Składowa R
      const green = image.bitmap.data[idx + 1]; // Składowa G
      const blue = image.bitmap.data[idx + 2]; // Składowa B
      const alpha = image.bitmap.data[idx + 3]; // Przezroczystość (A)

      // Modyfikacja składowej czerwonej (R)
      image.bitmap.data[idx] = Math.min(
        255,
        Math.max(0, red + redValueModifier)
      );
    }
  );

  //   await image.writeAsync(outputPath);
  // await image.write("kjkj.jpg");
  const imageData = context.createImageData(
    image.bitmap.width,
    image.bitmap.height
  );
  // Skopiuj dane pikseli z Jimp do ImageData
  imageData.data.set(image.bitmap.data);
  context.putImageData(
    imageData,
    0,
    0,
    0,
    0,
    image.bitmap.width,
    image.bitmap.height
  );
  console.log(`Zapisano zmodyfikowany obraz do ${outputPath}`);
}

export default async function modifyChannel(
  imagePath: string,
  channel: string,
  valueModifier: number
) {
  const image = await Jimp.read(imagePath);
  const canvas = document.getElementById("outCanvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    (x: any, y: any, idx: number) => {
      const red = image.bitmap.data[idx]; //  R
      const green = image.bitmap.data[idx + 1]; //  G
      const blue = image.bitmap.data[idx + 2]; //  B
      const alpha = image.bitmap.data[idx + 3];
      console.log(channel);
      if (channel === "red") {
        image.bitmap.data[idx] = Math.min(
          255,
          Math.max(0, red + valueModifier)
        );
      }
      if (channel === "green") {
        image.bitmap.data[idx + 1] = Math.min(
          255,
          Math.max(0, green + valueModifier)
        );
      }
      if (channel === "blue") {
        image.bitmap.data[idx + 2] = Math.min(
          255,
          Math.max(0, blue + valueModifier)
        );
      }
    }
  );
  const imageData = context.createImageData(
    image.bitmap.width,
    image.bitmap.height
  );
  imageData.data.set(image.bitmap.data);
  context.putImageData(
    imageData,
    0,
    0,
    0,
    0,
    image.bitmap.width,
    image.bitmap.height
  );
}
