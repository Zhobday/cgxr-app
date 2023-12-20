import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs';

const PoseDetectionComponent = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [model, setModel] = useState<tf.GraphModel | null>(null);

  useEffect(() => {
    // Load the model when the component mounts
    const loadModel = async () => {
        await tf.ready();
        const modelPath = 'http://localhost:5000/multipose-lightning';
        const loadedModel = await tf.loadGraphModel(`${modelPath}/model.json`);
        if (loadedModel == null) {
            return;
          }else{
              // Set the model in the component state
              setModel(loadedModel);
              console.log(model);
              return;
          }
    };

    // Initialize the camera and load the model
    const setupCameraAndModel = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              loadModel();
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
          }
    };
    setupCameraAndModel();

  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted />
      <div>
        <h2>Pose Information</h2>
        {/* Placeholder for displaying pose information */}
      </div>
    </div>
  );
};

export default PoseDetectionComponent;
