import { Mail } from "lucide-react";
import { wedding } from "@/lib/config";
import { Reveal } from "./reveal";
import { ScrollDownButton } from "./scroll-down-button";

/** Sobres cayendo de fondo — decorativo, se detiene con "reduce motion". */
const RAIN = [
  { left: "8%", size: 22, dur: "16s", delay: "0s", rot: "-14deg" },
  { left: "20%", size: 14, dur: "20s", delay: "3s", rot: "10deg" },
  { left: "33%", size: 18, dur: "13s", delay: "6s", rot: "-6deg" },
  { left: "47%", size: 12, dur: "22s", delay: "1.5s", rot: "16deg" },
  { left: "60%", size: 20, dur: "15s", delay: "8s", rot: "-10deg" },
  { left: "73%", size: 15, dur: "19s", delay: "4.5s", rot: "8deg" },
  { left: "86%", size: 24, dur: "17s", delay: "10s", rot: "-16deg" },
  { left: "94%", size: 13, dur: "21s", delay: "7s", rot: "12deg" },
];

export function Gifts() {
  const { title, detail, note } = wedding.gifts.envelope;

  return (
    <section className="snap-start relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-salt-50 py-16 text-twilight">
      {/* Lluvia de sobres */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {RAIN.map((e, i) => (
          <Mail
            key={i}
            className="envelope-fall absolute top-0 text-gold/45"
            style={
              {
                left: e.left,
                width: e.size,
                height: e.size,
                "--dur": e.dur,
                "--delay": e.delay,
                "--rot": e.rot,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="container relative">
        <Reveal className="text-center">
          <p className="eyebrow">Regalos</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">{title}</h2>
        </Reveal>

        {/* Sobre ilustrado con sello A&Y */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-8 w-full max-w-[290px]">
            <svg
              viewBox="0 0 200 150"
              className="w-full drop-shadow-[0_18px_30px_rgba(28,39,64,0.16)]"
              role="img"
              aria-label="Sobre con sello de Albert y Yuly"
            >
              <rect
                x="8" y="26" width="184" height="108" rx="12"
                fill="#FFFDF8" stroke="#C9A25E" strokeWidth="1.5"
              />
              <path
                d="M8 38 L100 104 L192 38"
                fill="none" stroke="#C9A25E" strokeWidth="1.5" strokeLinejoin="round"
              />
              <path
                d="M8 128 L74 82 M192 128 L126 82"
                fill="none" stroke="#C9A25E" strokeWidth="1" opacity="0.45"
              />
              <circle cx="100" cy="104" r="21" fill="#B9903F" />
              <circle cx="100" cy="104" r="17" fill="none" stroke="#FFFDF8" strokeWidth="0.75" opacity="0.6" />
              <text
                x="100" y="104" textAnchor="middle" dominantBaseline="central"
                fontFamily="Georgia, 'Times New Roman', serif" fontSize="17" fill="#FFFDF8"
              >
                A&amp;Y
              </text>
            </svg>
          </div>
        </Reveal>

        <Reveal delay={0.18} className="mx-auto mt-7 max-w-sm text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-gold">{detail}</p>
          <div className="horizon my-5" />
          <p className="text-sm leading-relaxed text-twilight/75">{note}</p>
        </Reveal>

        <ScrollDownButton variant="inline" tone="dark" />
      </div>
    </section>
  );
}
