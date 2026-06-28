import React from 'react';

/**
 * Sony Music SMERA logo (dot-matrix mark + wordmark), shared by the app header and login.
 */
export const SonyLogo = ({ svgClass = 'h-10 w-auto', titleClass = 'text-xl', align = 'items-center' }) => (
  <div className={`flex ${align} gap-3 group`}>
    <div className="flex items-center">
      <svg viewBox="0 0 80 80" className={`${svgClass} transition-transform group-hover:scale-105`} xmlns="http://www.w3.org/2000/svg">
        <g fill="#E60012" className="transition-all group-hover:drop-shadow-[0_0_8px_rgba(230,0,18,0.6)]">
          <circle cx="28" cy="12" r="2.5"/><circle cx="40" cy="12" r="2.5"/><circle cx="52" cy="12" r="2.5"/>
          <circle cx="16" cy="20" r="2.5"/><circle cx="24" cy="20" r="2.5"/><circle cx="32" cy="20" r="2.5"/><circle cx="40" cy="20" r="2.5"/><circle cx="48" cy="20" r="2.5"/><circle cx="56" cy="20" r="2.5"/><circle cx="64" cy="20" r="2.5"/>
          <circle cx="12" cy="28" r="2.5"/><circle cx="20" cy="28" r="2.5"/><circle cx="28" cy="28" r="2.5"/><circle cx="36" cy="28" r="2.5"/><circle cx="44" cy="28" r="2.5"/><circle cx="52" cy="28" r="2.5"/><circle cx="60" cy="28" r="2.5"/><circle cx="68" cy="28" r="2.5"/>
          <circle cx="12" cy="36" r="2.5"/><circle cx="20" cy="36" r="2.5"/><circle cx="28" cy="36" r="2.5"/><circle cx="36" cy="36" r="2.5"/><circle cx="44" cy="36" r="2.5"/><circle cx="52" cy="36" r="2.5"/><circle cx="60" cy="36" r="2.5"/><circle cx="68" cy="36" r="2.5"/>
          <circle cx="8" cy="44" r="2.5"/><circle cx="16" cy="44" r="2.5"/><circle cx="24" cy="44" r="2.5"/><circle cx="32" cy="44" r="2.5"/><circle cx="40" cy="44" r="2.5"/><circle cx="48" cy="44" r="2.5"/><circle cx="56" cy="44" r="2.5"/><circle cx="64" cy="44" r="2.5"/><circle cx="72" cy="44" r="2.5"/>
          <circle cx="8" cy="52" r="2.5"/><circle cx="16" cy="52" r="2.5"/><circle cx="24" cy="52" r="2.5"/><circle cx="32" cy="52" r="2.5"/><circle cx="40" cy="52" r="2.5"/><circle cx="48" cy="52" r="2.5"/><circle cx="56" cy="52" r="2.5"/><circle cx="64" cy="52" r="2.5"/><circle cx="72" cy="52" r="2.5"/>
          <circle cx="12" cy="60" r="2.5"/><circle cx="20" cy="60" r="2.5"/><circle cx="28" cy="60" r="2.5"/><circle cx="36" cy="60" r="2.5"/><circle cx="44" cy="60" r="2.5"/><circle cx="52" cy="60" r="2.5"/><circle cx="60" cy="60" r="2.5"/><circle cx="68" cy="60" r="2.5"/>
          <circle cx="16" cy="68" r="2.5"/><circle cx="24" cy="68" r="2.5"/><circle cx="32" cy="68" r="2.5"/><circle cx="40" cy="68" r="2.5"/><circle cx="48" cy="68" r="2.5"/><circle cx="56" cy="68" r="2.5"/><circle cx="64" cy="68" r="2.5"/>
          <circle cx="28" cy="76" r="2.5"/><circle cx="40" cy="76" r="2.5"/><circle cx="52" cy="76" r="2.5"/>
        </g>
      </svg>
    </div>
    <div className="flex flex-col">
      <span className="overline text-[10px]">Sony Music</span>
      <h1 className={`font-heading font-bold ${titleClass} text-white tracking-tight -mt-1`}>SMERA</h1>
    </div>
  </div>
);
