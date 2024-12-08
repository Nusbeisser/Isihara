/*
const test = () =>{
    odliczanie do startu np. 3.. 2.. 1.. i pojawia się obraz:

    wez obraz
    wybierz składową do zerownia (na jakiejś podstawie czy jak?) pomysł: składowa, czas co jaki następuje zmiana i wartośc o jaką następuje zmiana do wyboru wybieraków lub inputem, input by wymagał walidacji dodatkowych
    wyzeruj dana skladowa (-255)
    zapisz wartosci r g b
    pokaż obraz z wyzerowaną daną składową
    odczekaj sekundę po czym zwieksz wybraną składową o 19 i tak w kółko
    nasłuchuj na kliknięcie ustalonego klawisza, kliknięcie powoduje zapis aktualnego poziomu r g b np. do tablicy [{obraznr:1,r:2,g:30,b:90,czas:6}]
    po kliknięciu i zapisaniu jak wyżej od nowa test() z kolejnym obrazkiem z listy aż do wyczerpania listy
    gdy lista wyczerpana to pokaż wyniki skrótowo + szczegóły w excel
}

ponadto program powinno dac się zapisac kliknięciem przycisku + skrótem klawiszowym
*/

import { modifyChannel2 } from "./saturation/saturationChange";
import { Result } from "./types/results.interface";
import { analyzeRGBComponentsFromCanvas } from "./saturation/saturationMeasurement";

let spacePressed = false;
const resultsArray: Result[] = [];
let startDate: number;
let processingImageIndex = 0;
let interval: NodeJS.Timeout;
let startingSaturation = -255;

const canvas = document.getElementById("outCanvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");

const test = async (images: HTMLImageElement[], channel = "red") => {
  loadNewImage(images[processingImageIndex].src, channel);

  document.addEventListener("keydown", async (event) => {
    if (event.key === " " && !spacePressed) {
      console.log(resultsArray);
      console.log(processingImageIndex, images.length - 1);
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
      if (processingImageIndex === images.length) return;
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
      console.log("Space released!");
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

export default test;
