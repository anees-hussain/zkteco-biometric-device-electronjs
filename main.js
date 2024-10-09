// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { getMachineData, exportToExcel } = require("./zkDevice");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "renderer.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");
}

app.on("ready", createWindow);

// Handle IPC requests from renderer for machine data and export
ipcMain.handle("get-machine-data", async (event, ip) => {
  try {
    const data = await getMachineData(ip);
    return data;
  } catch (err) {
    console.error("Failed to get machine data:", err);
  }
});

ipcMain.handle("export-excel", (event, users, logs) => {
  exportToExcel(users, logs, mainWindow); // Pass mainWindow for the dialog
});