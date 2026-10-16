import React from "react";
export const StatusAnnouncer: React.FC<{ message: string }> = ({ message }) => (
  <div role="status" aria-live="polite" className="sr-only">{message}</div>
);
