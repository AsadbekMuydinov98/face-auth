import { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import * as faceapi from 'face-api.js';

const FullScreenWebcam = () => {
  const webcamRef = useRef(null);
  const [detectedFaces, setDetectedFaces] = useState([]);

  const videoConstraints = {
    width: window.innerWidth,
    height: window.innerHeight,
    facingMode: "user"
  };

  // Modellarni yuklash
  async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');
    await faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models');


      console.log("Model yuklandi!");
  }
  // Tasvirni doimiy ravishda tahlil qilish
  const detectFace = async () => {
    if (webcamRef.current) {
      const imgSrc = webcamRef.current.getScreenshot(); // Tasvirni olish
      if (imgSrc) {
        const imgBlob = await fetch(imgSrc).then(res => res.blob()); // data URL dan Blob ga o'tkazish
        const imgElement = await faceapi.bufferToImage(imgBlob); // Blob ni imgElement ga aylantirish
        const detections = await faceapi.detectAllFaces(imgElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        // Yuzni aniqlash
        if (detections.length > 0) {
          const recognizedFaces = await checkFaces(detections);
          setDetectedFaces(recognizedFaces);
        }
      }
    }
    requestAnimationFrame(detectFace); // Har bir freymda tekshirish
  };

  // Yuzlarni serverga yuborish
  const checkFaces = async (detections) => {
    const results = [];
    for (const detection of detections) {
      const descriptor = detection.descriptor;
      const response = await axios.post('http://localhost:4000/api/auth/check-faces', {
        descriptor: Array.from(descriptor)
      });

      if (response.data) {        
        results.push({ name: response.data.recognizedUsers[0].name, box: detection.detection.box });
      }
    }
    return results;
  };

  useEffect(() => {
    loadModels().then(() => {
      detectFace(); // Yuzni aniqlashni boshlash
    });
  }, []);
  

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
      {detectedFaces.map((face, index) => (
        <div key={index} style={{
          position: 'absolute',
          left: face.box.x,
          top: face.box.y,
          width: face.box.width,
          height: face.box.height,
          border: '2px solid green'
        }}>
          <span style={{ backgroundColor: 'green', color: 'white' }}>{face.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FullScreenWebcam;
