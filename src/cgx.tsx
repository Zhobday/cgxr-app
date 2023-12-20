import React, { useEffect, useRef, useState } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import Posetable from './Posetable';
import { PixelInput } from '@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces';

const CameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [poses, setPoses] = useState<any[]>([]);
  const detectorRef = useRef<poseDetection.PoseDetector>();
  

  useEffect(() => {
    
    const detectPoses = async () => {
      try {
        detectorRef.current = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
        const currentFramePoses = await detectorRef.current?.estimatePoses(videoRef.current as PixelInput);
        
        setPoses(currentFramePoses || []);
      } catch (error) {
        console.error('Error during pose detection:', error);
      }
    };

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
            // Call detectPoses every second using requestAnimationFrame
            const animate = () => {
              detectPoses();
              requestAnimationFrame(animate);
            };

            animate();

            // Cleanup function
            return () => {
              if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach((track) => track.stop());
              }
              tf.disposeVariables();
            };
          }
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initCamera();
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
