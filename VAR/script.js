let video = document.getElementById("video");
let replayVideo = document.getElementById("replayVideo");
let mediaRecorder;
let recordedChunks = [];
let useBackCamera = false;

async function startCamera() {
  if (mediaRecorder?.state === "recording") {
    stopRecording();
  }

  let constraints = {
    video: {
      facingMode: useBackCamera ? { exact: "environment" } : "user"
    },
    audio: false
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
  } catch (err) {
    alert("Camera access denied or not available.");
    console.error(err);
  }
}

function switchCamera() {
  useBackCamera = !useBackCamera;
  startCamera();
}

function startRecording() {
  recordedChunks = [];
  let stream = video.srcObject;
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    let blob = new Blob(recordedChunks, { type: "video/webm" });
    let url = URL.createObjectURL(blob);
    replayVideo.src = url;
    replayVideo.style.display = "block";
  };

  mediaRecorder.start();
  console.log("Recording started");
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    console.log("Recording stopped");
  }
}

function playReplay(speed) {
  if (replayVideo.src) {
    replayVideo.playbackRate = speed;
    replayVideo.currentTime = 0;
    replayVideo.play();
  } else {
    alert("No replay available yet.");
  }
}
