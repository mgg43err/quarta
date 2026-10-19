import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8 md:pb-24 md:pt-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            обжарка · Минск · с 2019 года
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.15] md:text-6xl">
            Кофе, который обжарили{" "}
            <span className="text-accent">на этой неделе</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
            Мы — маленькая обжарка «Кварта». Жарим партиями по 5 кг по
            четвергам, в пятницу развозим по Минску. К вам зерно приезжает на
            1–3 день после обжарки, а не через полгода.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#order"
              className="rounded-full bg-accent px-7 py-3 font-semibold text-paper transition-colors hover:bg-accent-hover"
            >
              Оставить заявку
            </a>
            <a
              href="#products"
              className="text-sm font-semibold underline underline-offset-4 hover:text-accent"
            >
              Посмотреть ассортимент ↓
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-3 -top-3 h-full w-full rounded-2xl border border-line md:-left-5 md:-top-5" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/coffee-hero.jpg"
              alt="Горячая чашка кофе, вокруг летают зерна на тёмном фоне"
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-right font-mono text-xs uppercase tracking-widest text-ink-soft">
            свежесть: 1–3 дня
          </p>
        </div>
      </div>
    </section>
  );
}
