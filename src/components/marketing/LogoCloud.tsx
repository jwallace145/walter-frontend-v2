import React from 'react';

const LogoCloud: React.FC = (): React.ReactElement => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg/8 font-semibold text-gray-900">
          Powered by the following technologies 🚀
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <object
            type="image/svg+xml"
            data="https://walterai-public-media-dev.s3.us-east-1.amazonaws.com/powered-by/aws-logo.svg"
            className="mx-auto w-32 h-32"
          />
          <object
            type="image/svg+xml"
            data="https://walterai-public-media-dev.s3.us-east-1.amazonaws.com/powered-by/python_logo.svg"
            className="mx-auto w-32 h-32"
          />
          <object
            type="image/svg+xml"
            data="https://walterai-public-media-dev.s3.us-east-1.amazonaws.com/powered-by/nextjs_logo.svg"
            className="mx-auto w-32 h-32"
          />
          <object
            type="image/svg+xml"
            data="https://walterai-public-media-dev.s3.us-east-1.amazonaws.com/powered-by/meta_logo.svg"
            className="mx-auto w-32 h-32"
          />
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
