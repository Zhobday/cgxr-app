// PoseTable.tsx

import React from 'react';

interface Pose {
  keypoints: {
    y: number;
    x: number;
    score: number;
    name: string;
  }[];
  score: number;
}

interface PoseTableProps {
  pose: Pose;
}

const PoseTable: React.FC<PoseTableProps> = ({ pose }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
      <thead>
        <tr>
          <th>Score</th>
          <th>Keypoints</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{pose.score}</td>
          <td>
            <ul>
              {pose.keypoints.map((keypoint, index) => (
                <li key={index}>{`${keypoint.name}: ('x=${keypoint.x}, y=${keypoint.y}, score=${keypoint.score})`}</li>
              ))}
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default PoseTable;
