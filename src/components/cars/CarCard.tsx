
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
    ? "bg-[#9F1717] text-white text-xs font-bold mt-3 px-4 py-1 rounded-full"
    : "bg-[#9F1717] text-white text-xs font-bold mt-3 px-4 py-1 rounded-full";

  const dotClasses = "w-1.5 h-1.5 bg-[#A82626] rounded-full";
  const textClasses = "text-xs font-medium";

  return (
    <div
      className={
        compact 
          ? "flex-shrink-0 w-full max-w-[240px] bg-white rounded-xl shadow-sm overflow-hidden" 
          : "bg-white p-4 rounded-xl shadow-sm"
      }
    >
      <img
        src={image}
        alt={name}
        className={
          compact
            ? "w-full h-40 object-cover rounded-t-xl"
            : "w-full h-48 object-cover rounded-lg mb-3"
        }
      />
      <div className={compact ? "p-3" : ""}>
        <h3 className="text-lg font-bold mb-2">{name}</h3>
        {price && (
          <div className="text-base font-bold text-[#9F1717] mb-2">{price}</div>
        )}
        <div className="space-y-1.5 mb-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 ${textClasses}`}
            >
              <div className={dotClasses} />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <button className={buttonClasses}>SAIBA MAIS</button>
      </div>
    </div>
  );
};
