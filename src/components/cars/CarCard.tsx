import React from "react";

interface CarCardProps {
  image: string;
  name: string;
  features: string[];
  price?: string;
  compact?: boolean;
}

export const CarCard = ({
  image,
  name,
  features,
  price,
  compact = false,
}: CarCardProps) => {
  const buttonClasses = compact
    ? "bg-[#9F1717] text-white text-[6px] font-extrabold mt-2.5 px-2.5 py-0.5 rounded-[20px]"
    : "bg-[#9F1717] text-neutral-100 text-[4px] font-extrabold mt-2.5 px-2.5 py-0.5 rounded-[17px]";

  const dotClasses = compact
    ? "w-1.5 h-1.5 bg-[#A82626] rounded-full"
    : "w-1 h-1 bg-[#A82626] rounded-full";

  const textClasses = compact
    ? "text-[6px] font-extrabold"
    : "text-[4px] font-extrabold";

  return (
    <div
      className={
        compact ? "flex-[shrink] w-28" : "bg-neutral-100 p-[15px] rounded-2xl"
      }
    >
      <img
        src={image}
        alt={name}
        className={
          compact
            ? "w-full h-[85px] rounded-[20px] mb-[10px]"
            : "w-full h-[78px] rounded-[16px] mb-[10px]"
        }
      />
      <div className="text-[8px] font-extrabold mb-[5px]">{name}</div>
      {price && (
        <div className="text-[6px] font-extrabold mb-[5px]">{price}</div>
      )}
      {features.map((feature, index) => (
        <div
          key={index}
          className={`flex items-center gap-[5px] ${textClasses}`}
        >
          <div className={dotClasses} />
          <span>{feature}</span>
        </div>
      ))}
      <button className={buttonClasses}>SAIBA MAIS</button>
    </div>
  );
};
