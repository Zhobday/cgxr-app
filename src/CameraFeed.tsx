import React, { useEffect, useRef } from 'react';

const CameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
        {/* Your buttons or controls */}
        <button onClick={() => console.log('Button Clicked')}>Function 1</button>
        <button onClick={() => console.log('Button Clicked')}>Function 2</button>
      </div>
    </div>
  );
};

export default CameraFeed;
