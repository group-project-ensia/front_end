import React from 'react';

export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-2xl shadow-md border border-gray-200 p-4 bg-white">
      {children}
    </div>
  );
};

export const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-2">{children}</div>;
};
