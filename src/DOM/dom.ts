import { Result } from "../types/results.interface";
import {
  generateCsv,
  generatePdf,
  resetAll,
  selectAndSavePng,
  test,
} from "../renderer";

import * as logo from "../assets/logo.png";

const logoApp = document.getElementById("logo") as HTMLImageElement;
logoApp.src = logo.default;

export const startButton = document.getElementById("startButton");
export const stopButton = document.getElementById("stopButton");
export const outCanvas = document.getElementById("outCanvas");

export const channelInput = document.getElementById(
  "channel"
) as HTMLSelectElement;
export const channelRange = document.getElementById(
  "channelRange"
) as HTMLInputElement;
export const timeRange = document.getElementById(
  "timeRange"
) as HTMLInputElement;
export const channelRangeDesc = document.getElementById(
  "channelRangeDesc"
) as HTMLInputElement;
export const timeRangeDesc = document.getElementById(
  "timeRangeDesc"
) as HTMLInputElement;
export const channelClear = document.getElementById(
  "channelClear"
) as HTMLInputElement;

export const resultsContainer = document.getElementById("results");
export const resultsListContainer = document.getElementById(
  "resultsListContainer"
);
export const startDesc = document.getElementById("startDesc");
export const buttonRe = document.getElementById("retest");
export const buttonPdf = document.getElementById("pdf");
export const buttonCsv = document.getElementById("csv");
export const selectAndSaveButton = document.getElementById("selectPng");
export const status = document.getElementById("status");

export const channelRangeContainer = document.getElementById(
  "channelRangeContainer"
);
export const timeRangeContainer = document.getElementById("timeRangeContainer");
const channelClearLabel = document.getElementById("channelClearLabel");
buttonPdf.addEventListener("click", async () => {
  generatePdf();
});
buttonCsv.addEventListener("click", async () => {
  generateCsv();
});
startButton.addEventListener("click", async () => {
  countdown();
});
stopButton.addEventListener("click", async () => {
  resetAll();
  channelClearLabel.after(timeRangeContainer);
  channelClearLabel.after(channelRangeContainer);
});
buttonRe.addEventListener("click", async () => {
  resetAll();
});
selectAndSaveButton.addEventListener("click", async () => {
  selectAndSavePng();
});

export const hide = (elements: HTMLElement[]) => {
  if (elements.length > 0 && elements[0] !== null)
    elements.map((el) => el.classList.add("hidden"));
};
export const show = (elements: HTMLElement[]) => {
  if (elements.length > 0 && elements[0] !== null)
    elements.map((el) => el.classList.remove("hidden"));
};
export const remove = (elements: HTMLElement[]) => {
  if (elements.length > 0 && elements[0] !== null)
    elements.map((el) => el.remove());
};
const countdownModal = document.getElementById("countdownModal");
const countdownNumber = document.getElementById("countdownNumber");
export const countdown = () => {
  show([countdownNumber, countdownModal]);

  let count = 3;
  countdownNumber.textContent = count.toString(); // Aktualizacja tekstu
  count--;

  const countdown = setInterval(() => {
    countdownNumber.textContent = count.toString(); // Aktualizacja tekstu
    count--;

    // Gdy odliczanie osiągnie 0, zatrzymaj
    if (count < 0) {
      clearInterval(countdown);
      hide([countdownNumber, countdownModal]);
      test();
      stopButton.before(channelRangeContainer);
      stopButton.before(timeRangeContainer);
    }
  }, 1000);
};

export const showResults = (results: Result[], testRunning: boolean) => {
  console.log("results: ", results);
  if (testRunning) return;
  const resultsList = document.createElement("div");
  resultsList.id = "resultsList";
  // div.className = "";
  results.map((result, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<p style="font-weight:bold;">Obraz numer: ${
      index + 1
    }</p>Czas: ${
      result.spacePressed
        ? result.time + " ms."
        : result.time + " ms - klawisz nie został wciśnięty"
    }<p>Średnia wartość zmienanej składowej: ${result.red.avg
      .toFixed(2)
      .replace(".", ",")}</p>`;
    resultsList.append(div);
  });
  resultsListContainer.prepend(resultsList);
  channelClearLabel.after(timeRangeContainer);
  channelClearLabel.after(channelRangeContainer);
  hide([stopButton]);
  show([resultsContainer]);
};
