"use client";

export const formatDateTimeLocal = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  // Pad month, day, hour, minute
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hour}:${min}`;
};
