
import React from "react";

interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
}

export const ValueCard = ({ icon, title, description }: ValueCardProps) => {
  return (
    <div className="border bg-neutral-100 text-center p-6 border-solid border-neutral-300 rounded-lg shadow-sm">
      <img
        src={icon}
        alt={`${title} Icon`}
        className="w-16 h-16 mx-auto mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-neutral-700">{description}</p>
    </div>
  );
};
