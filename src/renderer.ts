import "./index.css";
// import test from "./test";
import { modifyChannel } from "./saturation/saturationChange";
import { Result } from "./types/results.interface";
import { analyzeRGBComponentsFromCanvas } from "./saturation/saturationMeasurement";

import * as img1 from "./assets/2.png";
import * as img2 from "./assets/6.png";
import * as img3 from "./assets/7.png";
import * as logoWSPAsrc from "./assets/logoWSPA.png";
const createImagesArray = () => {
  const image1 = new Image();
  image1.src = img1.default;
  const image2 = new Image();
  image2.src = img2.default;
  const image3 = new Image();
  image3.src = img3.default;

  const logoWSPA = new Image();
  logoWSPA.src = logoWSPAsrc.default;

  imagesArray.push(image1, image2, image3);
};
import {
  hide,
  outCanvas,
  show,
  showResults,
  resultsContainer,
  stopButton,
  remove,
  startDesc,
  channelInput,
  channelRange,
  channelRangeDesc,
  status,
  channelClear,
  timeRange,
  timeRangeDesc,
} from "./DOM/dom";

const imagesArray: HTMLImageElement[] = [];

let testRunning = false;

// test variables
let spacePressed = false;
const resultsArray: Result[] = [];
let startDate: number;
let processingImageIndex = 0;
let timeout: NodeJS.Timeout;
let startingSaturation = -255;
const canvas = document.getElementById("outCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
let selectedChannel = "red";
let channelRangeValue = 10;
let timeRangeValue = 8;
let isChannelClear = false;
let resultDate = "";
let autoNext = false;

let keydownListener: (event: KeyboardEvent) => void;
let keyupListener: (event: KeyboardEvent) => void;

createImagesArray();

channelInput.addEventListener("change", async () => {
  selectedChannel = channelInput.options[channelInput.selectedIndex].value;
});
channelRange.addEventListener("input", (e) => {
  const value =
    e.target instanceof HTMLInputElement ? e.target.value : undefined;
  channelRangeDesc.innerHTML = value;
  channelRangeValue = Number(value);
});
channelClear.addEventListener("change", (e) => {
  const value =
    e.target instanceof HTMLInputElement ? e.target.checked : undefined;
  isChannelClear = value;
});
timeRange.addEventListener("input", (e) => {
  const value =
    e.target instanceof HTMLInputElement ? e.target.value : undefined;
  timeRangeDesc.innerHTML = value;
  timeRangeValue = Number(value);
});

export const test = async () => {
  if (testRunning) return;
  hide([startDesc]);
  show([canvas, stopButton]);
  if (keydownListener) {
    document.removeEventListener("keydown", keydownListener);
  }
  if (keyupListener) {
    document.removeEventListener("keyup", keyupListener);
  }

  testRunning = true;
  loadNewImage(imagesArray[processingImageIndex].src, selectedChannel);
  keydownListener = async (event) => {
    clearTimeout(timeout);
    if (event.key === " " && !spacePressed && testRunning) {
      if (processingImageIndex === imagesArray.length - 1) {
        const result = await analyzeRGBComponentsFromCanvas(canvas, !autoNext);
        resultsArray.push({
          time: Date.now() - startDate,
          red: result.red,
          green: result.green,
          blue: result.blue,
          spacePressed: result.spacePressed,
        });
        processingImageIndex++;
      }
      if (processingImageIndex === imagesArray.length) {
        testRunning = false;
        resultDate = new Date().toLocaleDateString("pl-PL");
        showResults(resultsArray, testRunning);
        hide([outCanvas]);
        return;
      }
      spacePressed = true;
      const result = await analyzeRGBComponentsFromCanvas(canvas, !autoNext);
      resultsArray.push({
        time: Date.now() - startDate,
        red: result.red,
        green: result.green,
        blue: result.blue,
        spacePressed: result.spacePressed,
      });
      autoNext = false;
      processingImageIndex++;
      loadNewImage(imagesArray[processingImageIndex].src, selectedChannel);
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
  startingSaturation = isChannelClear ? -255 : 0;
  const [imgData, saturationLevels] = await modifyChannel(
    imgSrc,
    channel,
    startingSaturation
  );
  context.putImageData(imgData, 0, 0, 0, 0, imgData.width, imgData.height);
  startDate = Date.now();

  timeout = setImageTimeout(imgSrc, channel);
};

const setImageTimeout = (imgSrc: string, channel: string) => {
  clearTimeout(timeout);
  if (!testRunning || !imgSrc) return;

  return setTimeout(async () => {
    if (!testRunning || !imagesArray[processingImageIndex].src) return;
    startingSaturation += channelRangeValue;
    const imgData = await modifyChannel(
      imagesArray[processingImageIndex].src,
      channel,
      startingSaturation
    );
    context.putImageData(
      imgData[0],
      0,
      0,
      0,
      0,
      imgData[0].width,
      imgData[0].height
    );
    // analyzeRGBComponentsFromCanvas(canvas, false);
    if (startingSaturation >= 255) {
      autoNext = true;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
      document.dispatchEvent(new KeyboardEvent("keyup", { key: " " }));
    }
    timeout = setTimeout(() => {
      if (!testRunning || !imagesArray[processingImageIndex].src) return;
      setImageTimeout(imagesArray[processingImageIndex].src, channel);
    }, (1 / timeRangeValue) * 1000);
  }, (1 / timeRangeValue) * 1000);
};

export const resetAll = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  clearTimeout(timeout);
  testRunning = false;
  resultsArray.length = 0;
  processingImageIndex = 0;
  startingSaturation = -255;
  hide([resultsContainer, stopButton, canvas]);
  show([startDesc]);
  remove([document.getElementById("resultsList")]);
};

export const selectAndSavePng = async () => {
  imagesArray.length = 0;
  const savedPaths = await window.electronAPI.savePngFile();

  if (savedPaths.length > 0) {
    status.textContent = `Wybrano zdjęć: ${savedPaths.length}.`;
    savedPaths.map((path) => {
      const img = new Image();
      img.src = path;
      imagesArray.push(img);
    });
  } else {
    createImagesArray();
  }
};

export const generatePdf = async () => {
  await window.electronAPI.createPdf(resultsArray, selectedChannel, resultDate);
};

export const generateCsv = async () => {
  await window.electronAPI.createCSV(resultsArray);
};
