import React from 'react';

const LoadingSpinner: React.FC = (): React.ReactElement => {
  return (
    <div className="flex items-center justify-center h-32">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
