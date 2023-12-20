import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs';

const PoseDetectionComponent = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [model, setModel] = useState<tf.GraphModel | null>(null);
    const cr = useRef<HTMLCanvasElement | null>(null);
    const [poses, setPoses] = useState<any[]>([]);
    const [capturedImageSrc, setCapturedImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // Load the model when the component mounts
    const loadModel = async () => {
        await tf.ready();
        const modelPath = 'http://localhost:5000/multipose-lightning';
        const loadedModel = await tf.loadGraphModel(`${modelPath}/model.json`);
        if (loadedModel == null) {
            return;
          }else{
              setModel(loadedModel);
              console.log(model);
              return;
          }
    };

    // Initialize the camera and load the model
    const setupCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
          }
    };

    const calculateSize = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
  
        // Ensure both width and height are multiples of 32
        const maxWidth = Math.floor(windowWidth / 32) * 32;
        const maxHeight = Math.floor(windowHeight / 32) * 32;
  
        // Set video and canvas size
        if (videoRef.current) {
          videoRef.current.width = maxWidth;
          videoRef.current.height = maxHeight;
        }
  
        if (cr.current) {
          cr.current.width = maxWidth;
          cr.current.height = maxHeight;
        }
      };

      const detectPoses = () => {
        const canvas = cr.current;
        const video = videoRef.current;
     
        if (!video || !canvas) {return;}

        const context = canvas.getContext('2d');

        if (!context) {return;}

        // Get image data from the canvas
        context.drawImage(video,0,0,canvas.width,canvas.height)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.width);
        const pixelData = imageData.data;
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImageSrc(dataUrl);

      }

      // Call calculateSize initially and add a resize event listener
      const setupAndDetect = async() => {
        await calculateSize();
        await setupCamera();
        await loadModel();
        const intervalId = setInterval(() => detectPoses(),1000);
        return () =>{
          clearInterval(intervalId)
        };
      }
      setupAndDetect();
      
      window.addEventListener('resize', calculateSize);

  
      // Remove the event listener when the component unmounts
      return () => {
        window.removeEventListener('resize', calculateSize);
      };
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
        <div>
            <video ref={videoRef} autoPlay playsInline muted />
            <canvas ref={cr} />
        </div>
        {capturedImageSrc && (
        <div>
          <h2>Captured Image</h2>
          <img src={capturedImageSrc} alt="Captured Frame" />
        </div>
      )}
    <div>
        <h2>Pose Information</h2>
        {/* Placeholder for displaying pose information */}
    </div>
    </div>
  );
};

export default PoseDetectionComponent;
