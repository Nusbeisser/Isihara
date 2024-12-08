export interface ElectronAPI {
  savePngFile: () => Promise<[] | null>; // Funkcja zwraca ścieżkę pliku lub null
}

declare global {
  interface Window {
    electronAPI: ElectronAPI; // Dodajemy typ dla window.electronAPI
  }
}
