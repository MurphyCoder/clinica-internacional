import Image from "next/image";
import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center space-x-1 space-y-3 text-sm text-gray-700">
        <Image
          src="/assets/logo.png"
          alt="Loading Agora Services"
          width={140}
          height={40}
        />
        <div className="flex items-center space-x-2">
          <svg
            fill="none"
            className="h-6 w-6 animate-spin"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>
          <p className="text-sm text-gray-700">Cargando servicios ...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
