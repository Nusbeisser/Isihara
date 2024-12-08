import "./index.css";
// import test from "./test";

import { modifyChannel2 } from "./saturation/saturationChange";
import { Result } from "./types/results.interface";
import { analyzeRGBComponentsFromCanvas } from "./saturation/saturationMeasurement";

import * as img1 from "./assets/2.png";
import * as img2 from "./assets/6.png";
import * as img3 from "./assets/7.png";

const createImagesArray = () => {
  const image1 = new Image();
  image1.src = img1.default;
  const image2 = new Image();
  image2.src = img2.default;
  const image3 = new Image();
  image3.src = img3.default;

  imagesArray.push(image1, image2, image3);
};
import { hide, outCanvas, showResults, startButton } from "./DOM/dom";

const canvasIn = document.getElementById("inCanvas") as HTMLCanvasElement;
const contextIn = canvasIn.getContext("2d");
const imagesArray: HTMLImageElement[] = [];
// Ścieżka do obrazu
const imagePath = "./assets/2.png";
let testRunning = false;

// test variables
let spacePressed = false;
const resultsArray: Result[] = [];
let startDate: number;
let processingImageIndex = 0;
let interval: NodeJS.Timeout;
let startingSaturation = -255;
const canvas = document.getElementById("outCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");

createImagesArray();
console.log(imagePath);
imagesArray[0].onload = async () => {
  contextIn.drawImage(imagesArray[0], 0, 0, canvasIn.width, canvasIn.height);
};
imagesArray[0].onerror = (err) => {
  console.error("Nie udało się załadować obrazu:", err);
};

startButton.addEventListener("click", async () => {
  if (!testRunning) {
    test(imagesArray);
  }
});

const test = async (images: HTMLImageElement[], channel = "red") => {
  testRunning = true;
  loadNewImage(images[processingImageIndex].src, channel);

  document.addEventListener("keydown", async (event) => {
    if (event.key === " " && !spacePressed) {
      console.log(resultsArray);
      if (processingImageIndex === images.length - 1) {
        const result = await analyzeRGBComponentsFromCanvas(canvas);
        resultsArray.push({
          time: Date.now() - startDate,
          red: result.red,
          green: result.green,
          blue: result.blue,
        });
        processingImageIndex++;
        clearInterval(interval);
      }
      if (processingImageIndex === images.length) {
        // testRunning = false;
        showResults(resultsArray);
        hide(outCanvas);
        return;
      }
      spacePressed = true;
      clearInterval(interval);
      const result = await analyzeRGBComponentsFromCanvas(canvas);
      resultsArray.push({
        time: Date.now() - startDate,
        red: result.red,
        green: result.green,
        blue: result.blue,
      });
      processingImageIndex++;
      loadNewImage(images[processingImageIndex].src, channel);
    }
  });
  document.addEventListener("keyup", (event) => {
    if (event.key === " " && spacePressed) {
      spacePressed = false;
    }
  });
};

const loadNewImage = async (imgSrc: string, channel: string) => {
  startingSaturation = -255;
  const [imgData, saturationLevels] = await modifyChannel2(
    imgSrc,
    channel,
    -255
  );
  context.putImageData(imgData, 0, 0, 0, 0, imgData.width, imgData.height);
  startDate = Date.now();

  interval = setImageInterval(imgSrc, channel);
};

const setImageInterval = (imgSrc: string, channel: string) => {
  return setInterval(async () => {
    startingSaturation += 2.5;
    const imgData = await modifyChannel2(imgSrc, channel, startingSaturation);
    context.putImageData(
      imgData[0],
      0,
      0,
      0,
      0,
      imgData[0].width,
      imgData[0].height
    );
    analyzeRGBComponentsFromCanvas(canvas);

    if (startingSaturation >= 255) clearInterval(interval);
  }, 125);
};

const resetAll = () => {
  console.log("reset");
};
