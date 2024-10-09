// renderer.js
const { ipcRenderer } = require("electron");

document.getElementById("fetchDataBtn").addEventListener("click", async () => {
  const ip = document.getElementById("ipInput").value;
  try {
    const { info, users, logs } = await ipcRenderer.invoke(
      "get-machine-data",
      ip
    );

    // Display machine info on the welcome screen
    document.getElementById(
      "machineInfo"
    ).innerText = `User Count: ${info.userCounts}, Log Count: ${info.logCounts}, Capacity: ${info.logCapacity}`;

    // Enable the export button and bind event to download Excel file
    document.getElementById("exportBtn").addEventListener("click", () => {
      ipcRenderer.invoke("export-excel", users.data, logs.data);
    });
  } catch (err) {
    console.error("Failed to fetch machine data:", err);
  }
});
