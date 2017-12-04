import {
    Component,
    NgZone
} from '@angular/core';
import {
    IonicPage,
    NavController
} from 'ionic-angular';
import {
    EventProvider
} from '../../providers/event/event';
import {
    BLE
} from 'ionic-native';


@IonicPage({
    name: 'event-create'
})
@Component({
    selector: 'page-event-create',
    templateUrl: 'event-create.html',
})
export class EventCreatePage {

    devices: any;
    deviceID: any;
    deviceName: any;
    isConnected: boolean;
    arduinoData = [];
    public tagNum: number;
    public steps: any;

    //id for ccommunication arduino & android
    service_UUID = "19B10010-E8F2-537E-4F6C-D104768A1214";
    color_UUID = "19B10011-E8F2-537E-4F6C-D104768A1214";


    constructor(private zone: NgZone, public navCtrl: NavController, public eventProvider: EventProvider) {
        this.devices = [];
        this.isConnected = false;

    }

    resetBLE() {
        this.devices = [];
        this.scanDevices();
        this.isConnected = false;
    }
    scanDevices() {
        if (BLE.isEnabled) {
            BLE.enable();
        }


        BLE.scan([], 20).subscribe((device) => {
            console.log(JSON.stringify(device));
            this.zone.run(() => { //running inside the zone because otherwise the view is not updated
                this.devices.push(device)
            });
        }, function(error) {
            console.log(error);
        });

        console.log(this.devices);

    }


    openDevicePage(id) {
        this.deviceID = id;
        this.devices = [];
        this.connect(this.deviceID);
    }
    connect(id) {
        BLE.connect(id).subscribe(
            peripheralData => {
                alert("Connected!");
                BLE.read(this.deviceID, this.service_UUID, this.color_UUID).then((buffer) => {
                    //convert bytes to string   
                    var convertData = String.fromCharCode.apply(null, new Uint8Array(buffer));
                    var data = [];
                    for (var i = 0; i < convertData.length; i++) {
                        var resultNumber = convertData.charCodeAt(i);
                        data[i] = (resultNumber.toString());
                        // alert("data from BLE:  " + data[i]);
                    }
                    this.tagNum = data[0];
                    //                  alert("first BLE stat" + this.tagNum);
                }, function(error) {
                    alert("Error Reading data" + JSON.stringify(error));
                });
            },
            error => alert("Error Connecting" + JSON.stringify(error))
        );
    }

    checkConnection() {
        BLE.isConnected(this.deviceID)
            .then(() => {
                console.log("connected")
                this.isConnected = true;
            }, () => {
                console.log("disconnected")
                this.isConnected = false;
            });
    }

    readData() {
        var data = [];
        BLE.read(this.deviceID, this.service_UUID, this.color_UUID)
            .then((buffer) => {

                    //convert bytes to string   \aw

                    var convertData = String.fromCharCode.apply(null, new Uint8Array(buffer));

                    for (var i = 0; i < convertData.length; i++) {
                        var resultNumber = convertData.charCodeAt(i);
                        data[i] = (resultNumber.toString());
                        // alert("data from BLE:  " + data[i]);
                    }
                    //update values in view
                    this.tagNum = data[0];
                    this.steps = data[1];
                },
                (error) => {
                    console.log(error);
                    alert("Try again! :)");
                });
    } //read data 


    createEvent(eventName: string, eventDate: string, eventCost: number) {

        this.eventProvider.createEvent(eventName, eventDate, this.tagNum, this.steps)
            .then(newEvent => {
                this.navCtrl.pop();
            });
    }
}