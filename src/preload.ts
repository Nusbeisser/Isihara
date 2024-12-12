// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { Result } from "./types/results.interface";
contextBridge.exposeInMainWorld("electronAPI", {
  savePngFile: () => ipcRenderer.invoke("select-and-save-png"),
  createPdf: (
    resultsArray: Result[],
    selectedChannel: string,
    resultDate: string
  ) =>
    ipcRenderer.invoke("create-pdf", {
      resultsArray,
      selectedChannel,
      resultDate,
    }),
  createCSV: (resultsArray: Result[]) =>
    ipcRenderer.invoke("create-csv", resultsArray),
});
