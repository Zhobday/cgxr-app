import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import Posetable from './Posetable';

const CameraFeed: React.FC = () => {

const videoRef = useRef<HTMLVideoElement | null>(null);
const canRef = useRef<HTMLCanvasElement | null>(null);

const [poses, setPoses] = useState<any[]>([]);
const [model, setModel] = useState<tf.GraphModel | null>(null);


const detectPoses = async () => {
    try { 
        const video = videoRef.current;
        const canvas = canRef.current;
        
        if (!video || !canvas) {return;}
         
        // Calculate canvas dimensions based on window size
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Ensure both width and height are multiples of 32
        const maxWidth = Math.floor(windowWidth / 32) * 32;
        const maxHeight = Math.floor(windowHeight / 32) * 32;

        const context = canvas.getContext('2d');

        if (!context) {return;}

        // Get image data from the canvas
        context.drawImage(video,0,0,maxWidth,maxHeight)
        const imageData = context.getImageData(0, 0, maxWidth, maxHeight);

        // Convert image data to Int32 tensor
        const tensor = tf.browser.fromPixels(imageData, 4); // Assuming RGBA format
        console.log(tensor);
    
    } catch (error) {
        console.log('Error during pose detection:',error)
    }

}

  useEffect(() => {

    const loadModel = async () => {
      try {
        // Check if the model is already in the cache
        const cachedModelJson = sessionStorage.getItem('myModel');
    
        if (cachedModelJson !== null) {
          console.log('Model found in cache.');
          const cachedModel = JSON.parse(cachedModelJson);
          setModel(cachedModel);
        } else {
          // Model is not in cache; load it
          const modelPath = 'http://my-express-server/path/to/model';
          const loadedModel = await tf.loadGraphModel(`${modelPath}/model.json`);
          if (loadedModel == null) {
            console.log('TS Could not load the model.');
            return;
          }
          console.log('Model loaded successfully:', loadedModel);
    
          // Save the model in session storage for future use
          sessionStorage.setItem('myModel', JSON.stringify(loadedModel));
    
          // Set the model in the component state
          setModel(loadedModel);
        }
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };
    


    const initCamera = async () => {
      try {
        await tf.ready();

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
      
    };

    loadModel();
    initCamera();
    const intervalId = setInterval(detectPoses, 250);

    return () => {
        clearInterval(intervalId)
    };

  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Video element for camera feed */}
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        autoPlay
        playsInline
        muted
        crossOrigin="anonymous"
      ></video>
      <canvas ref={canRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }}></canvas>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '10px',
          boxSizing: 'border-box',
        }}
      >
        {/* Render detected poses using the PoseTable component */}
        {Array.isArray(poses) && poses.map((pose, index) => (
          <Posetable key={index} pose={pose} />
        ))}

        {/* Your buttons or controls */}
        
        <button onClick={() => console.log('Button Clicked')}>Function 1</button>
        <button onClick={() => console.log('Button Clicked')}>Function 2</button>
      </div>
    </div>
  );
};

export default CameraFeed;
