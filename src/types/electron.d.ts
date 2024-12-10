import { Result } from "./results.interface";

export interface ElectronAPI {
  createCSV(data: Result[]): Promise<{ success: boolean } | null>;
  createPdf: (
    resultsArray: Result[],
    selectedChannel: string
  ) => Promise<{ success: boolean } | null>;
  savePngFile: () => Promise<[] | null>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
