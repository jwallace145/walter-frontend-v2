import React from 'react';
import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  width = 40,
  height = 40,
  alt = 'WalterAI Logo',
  className = 'mx-auto',
}) => {
  return (
    <Image
      src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default Logo;
