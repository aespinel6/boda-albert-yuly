"use client";

import { CalendarPlus } from "lucide-react";
import { wedding } from "@/lib/config";
import { Button } from "@/components/ui/button";

/** Genera y descarga un archivo .ics con el evento. */
export function AddToCalendar() {
  function download() {
    const start = new Date(wedding.date.iso);
    const end = new Date(start.getTime() + 5 * 60 * 60 * 1000); // +5h
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Albert & Yuly//Boda//ES",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@albertyuly.com`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      "SUMMARY:Boda de Albert & Yuly",
      `LOCATION:${wedding.ceremony.place}`,
      "DESCRIPTION:¡Nos casamos! Te esperamos para celebrar juntos.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "boda-albert-yuly.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="gold" onClick={download}>
      <CalendarPlus className="size-4" /> Agregar al calendario
    </Button>
  );
}
