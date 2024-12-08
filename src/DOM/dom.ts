import { Result } from "../types/results.interface";

export const startButton = document.getElementById("startButton");
export const stopButton = document.getElementById("stopButton");
export const outCanvas = document.getElementById("outCanvas");

export const channelInput = document.getElementById(
  "channel"
) as HTMLSelectElement;
export const channelRange = document.getElementById(
  "channelRange"
) as HTMLInputElement;
export const channelRangeDesc = document.getElementById(
  "channelRangeDesc"
) as HTMLInputElement;
export const resultsContainer = document.getElementById("results");
export const resultsListContainer = document.getElementById(
  "resultsListContainer"
);
export const startDesc = document.getElementById("startDesc");
export const buttonRe = document.getElementById("retest");
export const buttonPdf = document.getElementById("pdf");
export const buttonCsv = document.getElementById("csv");

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
    }</p>Czas po jakim został wciśnięty klawisz: ${
      result.time
    } ms. <p>Średnia wartość zmienanej składowej: ${result.red.avg}</p>`;
    resultsList.append(div);
  });
  resultsListContainer.prepend(resultsList);
  hide([stopButton]);
  show([resultsContainer]);
};
