import { Jimp } from "jimp";
import { RGB } from "../types/saturation.interface";

export async function modifyChannel(
  imagePath: string,
  channel: string,
  valueModifier: number
): Promise<[ImageData, RGB]> {
  const beforeScaleImage = await Jimp.read(imagePath);
  const image = beforeScaleImage.resize({ w: 500, h: 500 });
  const canvas = document.getElementById("outCanvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  let red, green, blue;
  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    (x: number, y: number, idx: number) => {
      red = image.bitmap.data[idx];
      green = image.bitmap.data[idx + 1];
      blue = image.bitmap.data[idx + 2];
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
