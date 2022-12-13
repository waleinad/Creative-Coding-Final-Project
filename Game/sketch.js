// The serviceUuid must match the serviceUuid of the device you would like to connect
// https://www.uuidgenerator.net/
const serviceUuid = "5db0217f-6715-4e63-b3d8-656d050233d6";
let myBLE;
let isConnected = false;

let imuCharacteristic;
let imuReading;

let fsrCharacteristic;
let fsrReading;


var jatekos;
var talaj_fal;
var grafika;
var money
var gomba;
var loves;
var pont_animacio;
var kilott_ellen_anim;
var mozgasv;

function setup() {
  // Create a p5ble class
  myBLE = new p5ble();
  createCanvas(705, 607.5);

  // textSize(20);
  // textAlign(CENTER, CENTER);

  // Create a 'Connect' button
  const connectButton = createButton('Connect')
  connectButton.mousePressed(connectToBle);

  // Create a 'Disconnect' button
  const disconnectButton = createButton('Disconnect')
  disconnectButton.mousePressed(disconnectToBle);

  jatekos = new Jatekos();
  talaj_fal = new Talaj_fal();
  grafika = new Grafika();
  penz = new Penz();
  gomba = new Gomba();
  virag = new Virag();
  ellenseg_gomba = new Ellenseg_gomba();
  ellenseg_kacsa = new Ellenseg_kacsa();
  loves = new Loves();
  pont_animacio = new Pont_animacio();
  kilott_ellen_anim = new Kilott_ellen_anim();
  palya_vege = new Palya_vege();
  mozgasv = new Mozgasv();

  loves.i = "j";
  textFont('monospace')
  angleMode(DEGREES);
  rectMode(CENTER);
  imageMode(CENTER);

  mozgasv.funkcio();

  for (let j = 0; j <= 2700 - 1; j++) {

    // palya_vege.rx -= jatekos.sebesseg_v2;
    //  palya_vege.zx -= jatekos.sebesseg_v2;
    //  palya_vege.vx -= jatekos.sebesseg_v2;

    for (let i = 0; i <= talaj_fal.x.length - 1; i++) {
      if (i >= 0 && i <= 230 || i >= 1000 && i <= 1012 || i >= 1050 && i <= 1081 || i >= 1100 && i <= 1198 || i >= 1300 && i <= 1302 || i >= 1350 && i <= 1350 || i >= 1400 && i <= 1401) {
        //   talaj_fal.x[i] -= jatekos.sebesseg_v2;
      }
    }
  }


}

//callback functions
function connectToBle() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

function disconnectToBle() {
  // Disonnect to the device
  myBLE.disconnect();
  // Check if myBLE is connected
  isConnected = myBLE.isConnected();
}

function onDisconnected() {
  console.log('Device got disconnected.');
  isConnected = false;
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
  console.log('characteristics: ', characteristics);

  // Check if myBLE is connected
  isConnected = myBLE.isConnected();

  // Add a event handler when the device is disconnected
  myBLE.onDisconnected(onDisconnected)

  // assign characteristic and value read callback
  // buttonCharacteristic = characteristics[0];
  for (let i = 0; i < characteristics.length; i++) {
    if(characteristics[i].uuid === "71d1847d-412d-4554-aef0-7cf5210d9504") {
      imuCharacteristic = characteristics[i]
    } else if (characteristics[i].uuid === "1e1011ce-a6a9-4bde-b4dc-ed561745c55a") {
      fsrCharacteristic = characteristics[i]
    }
  }

  // Read the value of the first characteristic
  myBLE.read(imuCharacteristic, gotIMUValue);
  myBLE.read(fsrCharacteristic, gotFSRValue);
}

// A function that will be called once got values
function gotIMUValue(error, value) {
  if (error) console.log('error: ', error);
  console.log('imu value: ', value);
  imuReading = value;
  // After getting a value, call p5ble.read() again to get the value again
  myBLE.read(imuCharacteristic, gotIMUValue);
  // You can also pass in the dataType
  // Options: 'unit8', 'uint16', 'uint32', 'int8', 'int16', 'int32', 'float32', 'float64', 'string'
  // myBLE.read(myCharacteristic, 'string', gotValue);
}

function gotFSRValue(error, value) {
  if (error) console.log('error: ', error);
  console.log('fsr value: ', value);
  fsrReading = value;
  myBLE.read(fsrCharacteristic, gotFSRValue);
}


function draw() {
  background(100, 150, 255);
  grafika.kfmegjelenites();
  palya_vege.megjelenites();

  if (jatekos.gomba_ == 0) {
    gomba.megjelenites();
  }

  if (jatekos.gomba_ > 0 || virag.lathato == true) {
    virag.megjelenites();
  }

  if (virag.felvett_virag == true) {
    loves.megjelenites();
  }

  if (jatekos.halal == false && palya_vege.vx - jatekos.x > 5) {
    jatekos.megjelenites();
  }

  talaj_fal.megjelenites();
  penz.megjelenites();
  ellenseg_gomba.megjelenites();
  ellenseg_kacsa.megjelenites();
  pont_animacio.megjelenites();
  kilott_ellen_anim.megjelenites();
  jatekos.meghal();

  mozgasv.funkcio();

  if(imuReading || imuReading === 0){
    // Write value on the canvas
    text(imuReading, 70, 120);
  }
  if(fsrReading || fsrReading === 0){
    // Write value on the canvas
    text(fsrReading, 150, 120);
  }

  if (palya_vege.mt == false) {
    if ((imuReading == "1") && jatekos.guggolas == false) {
      jatekos.jobbra = false;
      loves.i = "b";
    }

    if ((imuReading == "2") && jatekos.guggolas == false) {
      jatekos.jobbra = true;
      loves.i = "j";
    }

    if (fsrReading == "0") {
      if (jatekos.zuhanas == false) {
        jatekos.ugras = true;
      }
    }

  }

  
  if (imuReading == "0") {
    jatekos.balra = false;
    jatekos.jobbra = false;
  }
   
}

// function keyPressed() {

//   if (palya_vege.mt == false) {
//     if ((key == "a" || key == "A" || keyCode == "37") && jatekos.guggolas == false) {
//       jatekos.balra = true;
//       loves.i = "b";
//     }

//     if ((key == "d" || key == "D" || keyCode == "39") && jatekos.guggolas == false) {
//       jatekos.jobbra = true;
//       loves.i = "j";
//     }

//     if (key == "s" || key == "S" || keyCode == "40") {
//       jatekos.guggolas = true;
//     }

//     if (key == "w" || key == "W" || keyCode == "38") {
//       if (jatekos.zuhanas == false) {
//         jatekos.ugras = true;
//       }
//     }

//     if (key == "f" || key == "F") {
//       loves.e = true;
//     }

//     if (key == "Shift") {
//       jatekos.fut = true;
//     }

//   }
// }

// function keyReleased() {

//   if (key == "a" || key == "A" || keyCode == "37") {
//     jatekos.balra = false;
//   }

//   if (key == "d" || key == "D" || keyCode == "39") {
//     jatekos.jobbra = false;
//   }

//   if (key == "s" || key == "S" || keyCode == "40") {
//     jatekos.guggolas = false;
//   }

//   if (key == "f" || key == "F") {
//     loves.e = false;
//   }
//   if (key == "Shift") {
//     jatekos.fut = false;
//   }

//   key = "";

// }

function mousePressed() {
  jatekos.x = mouseX;
  jatekos.y = mouseY;
  print(mouseX);
  print(mouseY);
}