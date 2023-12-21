import React, { useEffect, useRef,useState } from 'react';
import * as tf from '@tensorflow/tfjs';


const CameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cr = useRef<HTMLCanvasElement | null>(null);
  const [capturedImageSrc, setCapturedImageSrc] = useState<string | null>(null);

  

  useEffect(() => {
    const initCamera = async () => {
      try {
        // Access the user's camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Assign the camera stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initCamera();
    loadModel();
  }, []);

  const handleResize = () => {
    if (videoRef.current && cr.current) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Ensure both width and height are multiples of 32
      const maxWidth = Math.floor(windowWidth / 32) * 32;
      const maxHeight = Math.floor(windowHeight / 32) * 32;

      // Set video element dimensions
      videoRef.current.width = maxWidth;
      videoRef.current.height = maxHeight;

      // Set canvas dimensions
      cr.current.width = maxWidth;
      cr.current.height = maxHeight;
    }
  };

  // Listen for window resize events
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial mount

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
  
      // Return cleanup function to clear the interval when needed
      return () => {
        clearInterval(intervalId);
      };
    }
  };  

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Video element for camera feed */}
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        autoPlay
        playsInline
        muted
      ></video>
      <canvas ref={cr} />
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
        {/* Your buttons or controls */}
        <button onClick={() => console.log('Button Clicked')}>Function 1</button>
        <button onClick={() => console.log('Button Clicked')}>Function 2</button>
      </div>
      {capturedImageSrc && (
        <div>
          <h2>Captured Image</h2>
          <img src={capturedImageSrc} alt="Captured Frame" />
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
