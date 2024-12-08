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
import {
  hide,
  outCanvas,
  show,
  showResults,
  startButton,
  buttonRe,
  resultsContainer,
  stopButton,
  remove,
  startDesc,
  channelInput,
  channelRange,
  channelRangeDesc,
} from "./DOM/dom";

const imagesArray: HTMLImageElement[] = [];

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
let selectedChannel = "red";
let channelRangeValue = 10;

let keydownListener: (event: KeyboardEvent) => void;
let keyupListener: (event: KeyboardEvent) => void;

createImagesArray();

startButton.addEventListener("click", async () => {
  if (testRunning) return;
  console.log(imagesArray);
  test(imagesArray);
  hide([startDesc]);
  show([canvas, stopButton]);
});
stopButton.addEventListener("click", async () => {
  resetAll();
});
buttonRe.addEventListener("click", async () => {
  console.log("re");
  resetAll();
});
channelInput.addEventListener("change", async () => {
  console.log(channelInput.options[channelInput.selectedIndex].value);
  selectedChannel = channelInput.options[channelInput.selectedIndex].value;
});
channelRange.addEventListener("input", (e) => {
  const value =
    e.target instanceof HTMLInputElement ? e.target.value : undefined;
  channelRangeDesc.innerHTML = value;
  channelRangeValue = Number(value);
});

const test = async (images: HTMLImageElement[]) => {
  if (keydownListener) {
    document.removeEventListener("keydown", keydownListener);
  }
  if (keyupListener) {
    document.removeEventListener("keyup", keyupListener);
  }

  testRunning = true;
  console.log(images);
  loadNewImage(images[processingImageIndex].src, selectedChannel);
  document.removeEventListener("keydown", () => {
    console.log("a");
  });
  keydownListener = async (event) => {
    if (event.key === " " && !spacePressed && testRunning) {
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
        testRunning = false;
        showResults(resultsArray, testRunning);
        clearInterval(interval);
        hide([outCanvas]);
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
      console.log("processingImageIndex", processingImageIndex);
      console.log("images.length", images.length);
      loadNewImage(images[processingImageIndex].src, selectedChannel);
    }
  };
  keyupListener = (event) => {
    if (event.key === " " && spacePressed) {
      spacePressed = false;
    }
  };

  document.addEventListener("keydown", keydownListener);
  document.addEventListener("keyup", keyupListener);
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
    startingSaturation += channelRangeValue;
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
    if (startingSaturation >= 255) {
      clearInterval(interval);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
      document.dispatchEvent(new KeyboardEvent("keyup", { key: " " }));
    }
  }, 125);
};

const resetAll = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  clearInterval(interval);
  testRunning = false;
  console.log("reset");
  resultsArray.length = 0;
  processingImageIndex = 0;
  startingSaturation = -255;
  hide([resultsContainer, stopButton, canvas]);
  show([startDesc]);
  remove([document.getElementById("resultsList")]);
};

const selectAndSaveButton = document.getElementById("selectPng");
const status = document.getElementById("status");

selectAndSaveButton.addEventListener("click", async () => {
  imagesArray.length = 0;
  const savedPaths = await window.electronAPI.savePngFile();

  if (savedPaths.length > 0) {
    status.textContent = `Wybrano plików: ${savedPaths.length}.`;
    savedPaths.map((path) => {
      console.log(path);
      const img = new Image();
      img.src = `./assets/${path}`;

      imagesArray.push(img);
    });
  } else {
    createImagesArray();
  }
});
