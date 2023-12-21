import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs';
import { set } from 'mongoose';

const PoseDetectionComponent = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const cr = useRef<HTMLCanvasElement | null>(null);
    const [poses, setPoses] = useState<any[]>([]);
    const [capturedImageSrc, setCapturedImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // Load the model when the component mounts
    const loadModel = async () => {
        await tf.ready();
        const modelPath = 'http://localhost:5000/multipose-lightning/model.json';
        const loadedModel = await tf.loadGraphModel(modelPath);
      
        if (loadedModel == null) {
          return;
        } else {
          const intervalId = setInterval(() => {
            const canvas = cr.current;
            const video = videoRef.current;
      
            if (!video || !canvas) {
              return;
            }
      
            const context = canvas.getContext('2d');
      
            if (!context) {
              return;
            }
      
            // Capture frame
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/png');
            setCapturedImageSrc(dataUrl);

            // Do something with imageData (e.g., log it)
            console.log('Captured frame:', imageData);
      
          }, 1000); // Interval in milliseconds (1000ms = 1 second)
      
          // Optionally, store the intervalId in state or elsewhere for cleanup
          // Cleanup example: clearInterval(intervalId);
      
          // Return cleanup function to clear the interval when needed
          return () => {
            clearInterval(intervalId);
          };
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
          if (cr.current) {
            // Set the width and height properties correctly based on videoRef
            cr.current.width = videoRef.current?.width || 0;
            cr.current.height = videoRef.current?.height || 0;
          }
      };

      // Call calculateSize initially and add a resize event listener
      const setupAndDetect = async() => {
        await calculateSize();
        await setupCamera();
        await loadModel();
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
            <video ref={videoRef} style={{ width: '100%', height: '100vh', position: 'relative' }} autoPlay  muted />
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
