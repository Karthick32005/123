let bleDevice;
let bleCharacteristic;
let isBluetoothConnected = false;

const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

const statusDisplay = document.getElementById('status');

async function connectBluetooth() {
  try {
    console.log("Requesting Bluetooth Device...");
    bleDevice = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,   // ✅ Show all devices
      optionalServices: [SERVICE_UUID]  // ✅ Still request our service
    });

    console.log("Connecting to GATT Server...");
    const server = await bleDevice.gatt.connect();

    console.log("Getting Service...");
    const service = await server.getPrimaryService(SERVICE_UUID);

    console.log("Getting Characteristic...");
    bleCharacteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

    isBluetoothConnected = true;

    bleDevice.addEventListener('gattserverdisconnected', () => {
      isBluetoothConnected = false;
      statusDisplay.textContent = 'Status: Disconnected';
      console.log("Device disconnected");
    });

    statusDisplay.textContent = 'Status: Connected';
    console.log("✅ Connected to ESP32!");
  } catch (error) {
    alert('Bluetooth connection failed: ' + error);
    console.error(error);
  }
}

function sendCommand(command) {
  if (isBluetoothConnected && bleCharacteristic) {
    const encoder = new TextEncoder();
    bleCharacteristic.writeValue(encoder.encode(command));
    console.log("Sent:", command);

