/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

import * as img1 from "./assets/2.jpg";
import modifyChannel from "./saturationChange/saturationChange";

const canvas = document.getElementById("inCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");

// Ścieżka do obrazu
const imagePath = "./assets/2.jpg";
// Ładowanie i rysowanie obrazu
const image = new Image();
image.src = img1.default;
console.log(imagePath);
image.onload = () => {
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  modifyChannel(imagePath, "blue", 500);
};

image.onerror = (err) => {
  console.error("Nie udało się załadować obrazu:", err);
};
