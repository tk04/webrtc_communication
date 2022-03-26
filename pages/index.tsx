import React, { useEffect, useState } from "react";

interface indexProps {}

const Index: React.FC<indexProps> = ({}) => {
  const [videoHeight, setVideoHeight] = useState();
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
      ////
      audio: false,
      video: {
        width: { min: 240, ideal: 240, max: 240 },
        height: { min: 240, ideal: 240, max: 240 },
        // optional: [{ sourceId: videoSource }],
        deviceId: videoSource,
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
    videoArea?.addEventListener("can", () => {
      console.log("PLAYING ");
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
  const takePhoto = () => {
    let width = 240;
    let height = 240;

    // const takeProfilePic = document.querySelector("#takeProfilePic");
    const profilePicCanvas = document.querySelector("canvas");
    const profilePicOutput = document.querySelector("#picOutput");
    const context = profilePicCanvas?.getContext("2d");
    const videoArea = document.querySelector("video");

    console.log("width: ", width, "height: ", height);
    if (width && height) {
      profilePicCanvas!.width = width;
      profilePicCanvas!.height = height;
      context!.drawImage(videoArea!, 0, 0, width, height);
      const dataUrl = profilePicCanvas!.toDataURL("image/png");
      profilePicOutput!.setAttribute("src", dataUrl);
    }
  };
  return (
    <div>
      Hello
      <button onClick={startVideo}>Start</button>
      <button onClick={stopVideo}>stop</button>
      <div>
        Video: <select id="camera"></select>
      </div>
      <button id="takeProfilePic" onClick={takePhoto}>
        Create Profile Picture
      </button>
      <canvas
        id="canvas"
        width="640"
        height="480"
        style={{ display: "none" }}
      ></canvas>
      <div>
        <img id="picOutput" />
      </div>
      <video autoPlay></video>
    </div>
  );
};

export default Index;
