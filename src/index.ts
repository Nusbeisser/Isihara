import { app, BrowserWindow, session, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";

import { saveCSVToFile } from "./csv/csv";
import { savePDFToFile } from "./pdf/pdf";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 850,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      webSecurity: false,
    },
  });
  const isDev = process.env.NODE_ENV === "development";
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  isDev ? mainWindow.webContents.openDevTools() : null;

  // images handler
  ipcMain.handle("select-and-save-png", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Wybierz pliki PNG",
      filters: [{ name: "Images", extensions: ["png"] }],
      properties: ["openFile", "multiSelections"],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const destFolder = isDev
        ? path.join(__dirname, "../renderer/assets")
        : path.join(app.getPath("userData"), "assets");
      fs.mkdirSync(destFolder, { recursive: true });

      const copiedFiles = [];
      for (const sourcePath of result.filePaths) {
        const fileName = path.basename("own-" + sourcePath);
        const destPath = path.join(destFolder, fileName);

        fs.copyFileSync(sourcePath, destPath);
        isDev
          ? copiedFiles.push(`./assets/${fileName}`)
          : copiedFiles.push(destPath);
      }

      return copiedFiles;
    }

    return [];
  });

  // pdf handler
  ipcMain.handle(
    "create-pdf",
    async (event, { resultsArray, selectedChannel, resultDate }) => {
      try {
        const { canceled, filePath } = await dialog.showSaveDialog({
          title: "Zapisz PDF",
          defaultPath: "data.pdf",
          filters: [{ name: "PDF Files", extensions: ["pdf"] }],
        });

        if (!canceled && filePath) {
          try {
            savePDFToFile(resultsArray, selectedChannel, resultDate, filePath);
          } catch (err) {
            return { success: false };
          }
        }
        return { success: true, filePath };
      } catch (error) {
        return { success: false };
      }
    }
  );

  // csv handler
  ipcMain.handle("create-csv", async (event, data) => {
    try {
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: "Zapisz dane jako CSV",
        defaultPath: "data.csv",
        filters: [{ name: "CSV Files", extensions: ["csv"] }],
      });

      if (!canceled && filePath) {
        try {
          saveCSVToFile(data, filePath);
        } catch (err) {
          return { success: false };
        }
        return { success: true, filePath };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  // Customize protocol to handle static resource.
  session.defaultSession.protocol.registerFileProtocol(
    "static",
    (request, callback) => {
      const fileUrl = request.url.replace("static://", "");
      const filePath = path.join(
        app.getAppPath(),
        ".webpack/renderer",
        fileUrl
      );
      callback(filePath);
    }
  );

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
