const ZKLib = require("node-zklib");

const getMachineData = async (ip) => {
  let zkInstance = new ZKLib(ip, 4370, 10000, 4000); // ip, port, timeout, inport
  try {
    // Create socket to machine
    await zkInstance.createSocket();

    // Get general info like logCapacity, user counts, logs count
    // It's really useful to check the status of device
    const info = await zkInstance.getInfo();
    console.log("info", info)
  } catch (e) {
    console.log(e);
    if (e.code === "EADDRINUSE") {
    }
  }

  //---------------------------------------------------------------------------
  // Get users in machine
  const users = await zkInstance.getUsers();
  console.log("users", users)

  //----------------------------------------------------------------------------
  // Get all logs in the machine
  const logs = await zkInstance.getAttendances();
  console.log("attendance data", logs);
};

getMachineData('192.168.10.99');