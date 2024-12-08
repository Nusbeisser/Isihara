import { Bitmap, Jimp } from "jimp";

export default async function modifyChannel(
  imagePath: string,
  channel: string,
  valueModifier: number
) {
  console.log(imagePath);
  const image = await Jimp.read(imagePath);
  // const canvasIn = document.getElementById("inCanvas") as HTMLCanvasElement;
  // const contextIn = canvasIn.getContext("2d");
  const canvas = document.getElementById("outCanvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  let red, green, blue;
  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    (x: number, y: number, idx: number) => {
      red = image.bitmap.data[idx]; //  R
      green = image.bitmap.data[idx + 1]; //  G
      blue = image.bitmap.data[idx + 2]; //  B
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
  console.log(channel);
  console.log(red);
  console.log(green);
  console.log(blue);
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
  // contextIn.putImageData(
  //   imageData,
  //   0,
  //   0,
  //   0,
  //   0,
  //   image.bitmap.width,
  //   image.bitmap.height
  // );
}

export async function modifyChannel2(
  imagePath: string,
  channel: string,
  valueModifier: number
): Promise<[ImageData, any]> {
  console.log(imagePath);
  const image = await Jimp.read(imagePath);
  const canvas = document.getElementById("outCanvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  let red, green, blue;
  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    (x: number, y: number, idx: number) => {
      red = image.bitmap.data[idx]; //  R
      green = image.bitmap.data[idx + 1]; //  G
      blue = image.bitmap.data[idx + 2]; //  B
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
  return [imageData, { red, green, blue }];
}
