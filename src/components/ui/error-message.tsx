// src/components/ui/error-message.tsx

"use client";

export const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-sm font-medium text-destructive mt-1">{message}</p>;
};
