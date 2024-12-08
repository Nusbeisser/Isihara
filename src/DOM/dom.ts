import { Result } from "../types/results.interface";

export const startButton = document.getElementById("startButton");
export const stopButton = document.getElementById("stopButton");
export const outCanvas = document.getElementById("outCanvas");
export const resultsContainer = document.getElementById("results");
export const hide = (element: HTMLElement) => {
  element.classList.add("hidden");
};
export const show = (element: HTMLElement) => {
  element.classList.remove("hidden");
};

export const showResults = (results: Result[]) => {
  console.log(results);

  // div.className = "";
  results.map((result, index) => {
    const div = document.createElement("div");
    div.innerHTML = `Obraz numer ${
      index + 1
    }. Czas po jakim został wciśnięty klawisz ${
      result.time
    } ms. Średnia wartość zmienanej składowej: ${result.red.avg}`;
    document.body.appendChild(div);
  });
  const buttonRe = document.createElement("button");
  buttonRe.innerHTML = "Ponowny test";
  const buttonPdf = document.createElement("button");
  buttonPdf.innerHTML = "Wygeneruj Pdf";
  const buttonXls = document.createElement("button");
  buttonXls.innerHTML = "Wygeneruj Xls";
  document.body.appendChild(buttonRe);
  document.body.appendChild(buttonPdf);
  document.body.appendChild(buttonXls);
};
