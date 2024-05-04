import React, { useState } from "react";
import "./App.css";

function App() {
  // Logic for audio recording
  const [redAudioBlob, setRedAudioBlob] = useState(null);
  const [blueAudioBlob, setBlueAudioBlob] = useState(null);
  const [greenAudioBlob, setGreenAudioBlob] = useState(null);
  const [recordingInProgress, setRecordingInProgress] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);

  const startRecording = (color) => {
    setActiveColor(color);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/wav" });
          switch (color) {
            case "red":
              setRedAudioBlob(blob);
              break;
            case "blue":
              setBlueAudioBlob(blob);
              break;
            case "green":
              setGreenAudioBlob(blob);
              break;
            default:
              break;
          }
          setRecordingInProgress(false);
          setActiveColor(null);
          if (mediaStream) {
            mediaStream.getTracks().forEach((track) => track.stop());
          }
        };

        mediaRecorder.start();
        setRecordingInProgress(true);
        setMediaStream(stream);
      })
      .catch((err) => console.error("Error accessing media devices: ", err));
  };

  const stopRecording = () => {
    setActiveColor(null);
    setRecordingInProgress(false);
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  };

  const resetAudioBlob = (color) => {
    switch (color) {
      case "red":
        setRedAudioBlob(null);
        break;
      case "blue":
        setBlueAudioBlob(null);
        break;
      case "green":
        setGreenAudioBlob(null);
        break;
      default:
        break;
    }
  };

  const sendRecording = (fromColor, toColor) => {
    let audioBlob = null;
    switch (fromColor) {
      case "red":
        audioBlob = redAudioBlob;
        break;
      case "blue":
        audioBlob = blueAudioBlob;
        break;
      case "green":
        audioBlob = greenAudioBlob;
        break;
      default:
        break;
    }

    switch (toColor) {
      case "red":
        setRedAudioBlob(audioBlob);
        break;
      case "blue":
        setBlueAudioBlob(audioBlob);
        break;
      case "green":
        setGreenAudioBlob(audioBlob);
        break;
      default:
        break;
    }
  };

  const AudioControl = ({ color, audioBlob, onReset }) => {
    return (
      <div>
        <audio controls>
          <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
        <button onClick={() => onReset(color)}>Reset</button>
      </div>
    );
  };

  // Logic for file upload
  const [redAudio, setRedAudio] = useState(null);
  const [blueAudio, setBlueAudio] = useState(null);
  const [greenAudio, setGreenAudio] = useState(null);

  const handleFileChange = (color, event) => {
    const file = event.target.files[0];
    switch (color) {
      case "red":
        setRedAudio(file);
        break;
      case "blue":
        setBlueAudio(file);
        break;
      case "green":
        setGreenAudio(file);
        break;
      default:
        break;
    }
  };

  const resetAudio = (color) => {
    switch (color) {
      case "red":
        setRedAudio(null);
        break;
      case "blue":
        setBlueAudio(null);
        break;
      case "green":
        setGreenAudio(null);
        break;
      default:
        break;
    }
  };

  const sendAudio = (fromColor, toColor) => {
    let audio = null;
    switch (fromColor) {
      case "red":
        audio = redAudio;
        break;
      case "blue":
        audio = blueAudio;
        break;
      case "green":
        audio = greenAudio;
        break;
      default:
        break;
    }

    switch (toColor) {
      case "red":
        setRedAudio(audio);
        break;
      case "blue":
        setBlueAudio(audio);
        break;
      case "green":
        setGreenAudio(audio);
        break;
      default:
        break;
    }
  };

  const AudioControlFile = ({ color, audio, onReset }) => {
    return (
      <div>
        <audio controls>
          <source src={URL.createObjectURL(audio)} />
        </audio>
        <button onClick={() => onReset(color)}>Reset</button>
      </div>
    );
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Multicommunication Device</h1>
      <div style={{ backgroundColor: "red" }}>
        {!recordingInProgress && !redAudioBlob && (
          <button onClick={() => startRecording("red")}>Record</button>
        )}
        {recordingInProgress && activeColor === "red" && (
          <button onClick={stopRecording}>Stop</button>
        )}
        {redAudioBlob && (
          <div>
            <AudioControl
              color="red"
              audioBlob={redAudioBlob}
              onReset={resetAudioBlob}
            />
            <button onClick={() => sendRecording("red", "blue")}>
              Send Recording to Blue
            </button>
            <button onClick={() => sendRecording("red", "green")}>
              Send Recording to Green
            </button>
          </div>
        )}
        <input type="file" onChange={(e) => handleFileChange("red", e)} />
        {redAudio && (
          <div>
            <AudioControlFile
              color="red"
              audio={redAudio}
              onReset={resetAudio}
            />
            <button onClick={() => sendAudio("red", "blue")}>
              Send Audio to Blue
            </button>
            <button onClick={() => sendAudio("red", "green")}>
              Send Audio to Green
            </button>
          </div>
        )}
      </div>
      <div style={{ backgroundColor: "blue" }}>
        {!recordingInProgress && !blueAudioBlob && (
          <button onClick={() => startRecording("blue")}>Record</button>
        )}
        {recordingInProgress && activeColor === "blue" && (
          <button onClick={stopRecording}>Stop</button>
        )}
        {blueAudioBlob && (
          <div>
            <AudioControl
              color="blue"
              audioBlob={blueAudioBlob}
              onReset={resetAudioBlob}
            />
            <button onClick={() => sendRecording("blue", "red")}>
              Send Recording to Red
            </button>
            <button onClick={() => sendRecording("blue", "green")}>
              Send Recording to Green
            </button>
          </div>
        )}
        <input type="file" onChange={(e) => handleFileChange("blue", e)} />
        {blueAudio && (
          <div>
            <AudioControlFile
              color="blue"
              audio={blueAudio}
              onReset={resetAudio}
            />
            <button onClick={() => sendAudio("blue", "red")}>
              Send Audio to Red
            </button>
            <button onClick={() => sendAudio("blue", "green")}>
              Send Audio to Green
            </button>
          </div>
        )}
      </div>
      <div style={{ backgroundColor: "green" }}>
        {!recordingInProgress && !greenAudioBlob && (
          <button onClick={() => startRecording("green")}>Record</button>
        )}
        {recordingInProgress && activeColor === "green" && (
          <button onClick={stopRecording}>Stop</button>
        )}
        {greenAudioBlob && (
          <div>
            <AudioControl
              color="green"
              audioBlob={greenAudioBlob}
              onReset={resetAudioBlob}
            />
            <button onClick={() => sendRecording("green", "red")}>
              Send Recording to Red
            </button>
            <button onClick={() => sendRecording("green", "blue")}>
              Send Recording to Blue
            </button>
          </div>
        )}
        <input type="file" onChange={(e) => handleFileChange("green", e)} />
        {greenAudio && (
          <div>
            <AudioControlFile
              color="green"
              audio={greenAudio}
              onReset={resetAudio}
            />
            <button onClick={() => sendAudio("green", "red")}>
              Send Audio to Red
            </button>
            <button onClick={() => sendAudio("green", "blue")}>
              Send Audio to Blue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
