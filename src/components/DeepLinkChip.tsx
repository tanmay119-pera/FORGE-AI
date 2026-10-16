import React from "react";
export const DeepLinkChip: React.FC<{ href: string; title: string }> = ({ href, title }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded bg-cyan-600/20 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-600/30">{title}</a>
);
