import React, { useEffect } from "react";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
  useEffect(() => {
    const videoSelector = document.querySelector("#camera");
    videoSelector?.addEventListener("change", startVideo);
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      getCameras(devices);
    });
    function getCameras(devices: MediaDeviceInfo[]) {
      devices.forEach((device) => {
        if (device.kind === "videoinput") {
          console.log(device.label);
          const option = document.createElement("option");
          option.value = device.deviceId;
          option.text =
            device.label || "camera " + (videoSelector!.childNodes.length + 1);
          videoSelector!.appendChild(option);
        }
      });
    }
  }, []);

  let stream1: any;
  const startVideo = () => {
    const videoSource = (document.querySelector("#camera") as HTMLSelectElement)
      .value;
    const constraints = {
      audio: false,
      video: {
        width: { min: 1280, ideal: 1920, max: 2560 },
        height: { min: 720, ideal: 1080, max: 1440 },
        // optional: [{ sourceId: videoSource }],
      },
    };
    const videoArea = document.querySelector("video");
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        stream1 = stream;
        console.log("stream: ", stream);
        videoArea!.srcObject = stream;
        videoArea!.play();
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  };
  const stopVideo = () => {
    // const track = stream1.getVideoTracks()[0];
    // console.log("capabilities: ", track.getCapabilities()); //get constraint capabilities

    // const constraints = {
    //   // width: { min: 640, ideal: 1280 },
    //   // height: { min: 480, ideal: 720 },
    //   advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }],
    // };
    // track.applyConstraints(constraints); // adjust the constraints //
    const videoArea = document.querySelector("video");
    videoArea!.srcObject = null;
    console.log("stream1: ", stream1.getTracks());

    stream1.getTracks().forEach((track: any) => track.stop());
  };
  return (
    <div>
      Hello
      <button onClick={startVideo}>Start</button>
      <button onClick={stopVideo}>stop</button>
      <div>
        Video: <select id="camera"></select>
      </div>
      <video autoPlay width="100" height="100"></video>
    </div>
  );
};

export default Index;
