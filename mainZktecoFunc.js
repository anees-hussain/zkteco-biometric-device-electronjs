const ZKLib = require("node-zklib");

const getMachineData = async (ip) => {
  let zkInstance = new ZKLib(ip, 4370, 10000, 4000); // ip, port, timeout, inport
  try {
    // Create socket to machine
    await zkInstance.createSocket();

    // Get general info like logCapacity, user counts, logs count
    // It's really useful to check the status of device
    const info = await zkInstance.getInfo();
    return info;
  } catch (e) {
    console.log(e);
    if (e.code === "EADDRINUSE") {
    }
  }

  //---------------------------------------------------------------------------
  // Get users in machine
  const users = await zkInstance.getUsers();

  //----------------------------------------------------------------------------
  // Get all logs in the machine
  const logs = await zkInstance.getAttendances();
  console.log(logs);

  //----------------------------------------------------------------------------
  // const attendances = await zkInstance.getAttendances((percent, total)=>{
  //     // this callbacks take params is the percent of data downloaded and total data need to download
  // })

  //-----------------------------------------------------------------------------
  //   zkInstance.getRealTimeLogs((data)=>{
  //       // do something when some checkin
  //       console.log(data)
  //   })

  //------------------------------------------------------------------------------
  // delete the attendance data in machine
  // You should do this when there are too many data in the machine, this issue can slow down machine
  //   zkInstance.clearAttendanceLog();

  //-------------------------------------------------------------------------------
  // // Disconnect the machine ( don't do this when you need realtime update :)))
  //   await zkInstance.disconnect()
};

getMachineData("192.168.10.99");

module.exports = getMachineData;
