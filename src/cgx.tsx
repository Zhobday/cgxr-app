// CameraFeed.tsx

import React, { useEffect, useRef, useState } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import Posetable from './Posetable'; // Adjust the import path based on your project structure
import { PixelInput } from '@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces';

const CameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [poses, setPoses] = useState<any[]>([]);

  useEffect(() => {

    const detectPoses =async () => {
      try {
        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
        const currentFramePoses = await detector.estimatePoses(videoRef.current as PixelInput);
        setPoses(currentFramePoses);
      } catch (error) {
        console.error('Error during pose detection:', error);
      }
    }
    const initCamera = async () => {
        try {
          await tf.ready();
      
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
      
            // Wait for the video metadata to be loaded
            await new Promise((resolve) => {
              videoRef.current?.addEventListener('loadedmetadata', resolve);
            });
      
            // Ensure video stream is available
            if (videoRef.current.srcObject && videoRef.current.srcObject.active) {
              detectPoses();
            }
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      };

    initCamera();

    // Cleanup function
    return () => {
      // Release the camera stream and perform other cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }

      // Dispose of any TensorFlow.js resources if needed
      tf.disposeVariables();
    };
  },);

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
