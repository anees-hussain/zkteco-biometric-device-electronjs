const ZKLib = require("node-zklib");
const XLSX = require("xlsx");
const { dialog } = require("electron");

/**
 * Function to fetch machine data (info, users, logs)
 * @param {string} ip - The IP address of the biometric device
 * @returns {object} Object containing machine info, users, and logs
 */
const getMachineData = async (ip) => {
  const zkInstance = new ZKLib(ip, 4370, 10000, 4000); // ip, port, timeout, inport
  try {
    // Create socket to machine
    await zkInstance.createSocket();

    // Get machine info (user counts, logs counts, etc.)
    const info = await zkInstance.getInfo();
    console.log("Machine Info:", info);

    // Get users in the machine
    const users = await zkInstance.getUsers();
    console.log("Users:", users);

    // Get attendance logs
    const logs = await zkInstance.getAttendances();
    console.log("Attendance Logs:", logs);

    return { info, users, logs };
  } catch (e) {
    console.error("Error connecting to the biometric device:", e);
    throw e;
  }
};

/**
 * Function to export user and attendance data into Excel
 * @param {Array} users - Array of user data
 * @param {Array} logs - Array of attendance logs
 * @param {BrowserWindow} window - The Electron window to trigger file dialog
 */

const exportToExcel = async (users, logs, window) => {
  // Show Save As dialog for file location
  const { filePath } = await dialog.showSaveDialog(window, {
    title: "Save Attendance Data",
    defaultPath: "AttendanceData.xlsx",
    filters: [{ name: "Excel Files", extensions: ["xlsx"] }],
  });

  if (!filePath) {
    // Show cancel message
    await dialog.showMessageBox(window, {
      type: "info",
      title: "Cancelled",
      message: "File save cancelled.",
    });

    console.log("File save cancelled.");
    return;
  }

  // Create new workbook
  const workbook = XLSX.utils.book_new();

  // Prepare user data, remove 'role' column
  const userSheetData = users.map((user) => ({
    UserID: user.userId,
    Name: user.name,
    // Password: user.password, // Keep only relevant fields
    // CardNo: user.cardno,
  }));
  const userSheet = XLSX.utils.json_to_sheet(userSheetData);
  XLSX.utils.book_append_sheet(workbook, userSheet, "Users");

  // Map user IDs to names for attendance logs
  const userIdToName = {};
  users.forEach((user) => {
    userIdToName[user.userId] = user.name;
  });

  // Prepare attendance log data with User Name, Date, and Time columns
  const logSheetData = logs.map((log) => {
    const recordDate = new Date(log.recordTime);
    return {
      UserID: log.deviceUserId,
      UserName: userIdToName[log.deviceUserId] || "Unknown", // Map User ID to Name
      Date: recordDate.toLocaleDateString(), // Separate Date
      Time: recordDate.toLocaleTimeString(), // Separate Time
      // IP: log.ip,
    };
  });
  const logSheet = XLSX.utils.json_to_sheet(logSheetData);
  XLSX.utils.book_append_sheet(workbook, logSheet, "Attendance Logs");

  // Write workbook to the selected file path
  XLSX.writeFile(workbook, filePath);

  // Show success message after file is saved
  await dialog.showMessageBox(window, {
    type: "info",
    title: "Success",
    message: `Excel file has been successfully saved at: ${filePath}`,
  });

  console.log(`Excel file saved at: ${filePath}`);
};

module.exports = { getMachineData, exportToExcel };
