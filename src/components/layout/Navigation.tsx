import React from "react";

export const Navigation = () => {
  return (
    <nav className="bg-[#FF0000] text-neutral-100 py-[5px]">
      <div className="max-w-none mx-auto px-5 max-md:max-w-[991px] max-sm:max-w-screen-sm">
        <div className="flex justify-between items-center max-sm:hidden">
          <div className="text-xs font-semibold">Veículos</div>
          <div className="text-xs font-semibold">Sobre Nós</div>
          <div className="text-xs font-medium">Financiamento</div>
          <div className="text-xs font-semibold">Contato</div>
        </div>
        <div className="sm:hidden">
          <i className="ti ti-menu-2 text-2xl" />
        </div>
      </div>
    </nav>
  );
};
