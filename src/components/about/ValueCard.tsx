import React from "react";

interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
}

export const ValueCard = ({ icon, title, description }: ValueCardProps) => {
  return (
    <div className="border bg-neutral-100 text-center p-[15px] border-solid border-[rgba(0,0,0,0.8)]">
      <img
        src={icon}
        alt={`${title} Icon`}
        className="w-[40px] h-[40px] mx-auto mb-[10px]"
      />
      <div className="text-[7px] font-normal mb-[5px]">{title}</div>
      <div className="text-[5px] font-bold">{description}</div>
    </div>
  );
};
