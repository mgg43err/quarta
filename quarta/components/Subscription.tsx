import Image from "next/image";
import Reveal from "./Reveal";

export default function Subscription() {
  return (
    <section id="subscription" className="bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_0.8fr] md:items-center md:px-8 md:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
            03 · подписка
          </p>
          <h2 className="mt-4 font-display text-3xl md:text-4xl">
            Домашняя подписка «без подзаводки»
          </h2>
          <div className="mt-6 max-w-lg space-y-4 leading-relaxed text-paper/80">
            <p>
              Раз в месяц, в пятницу, к вашей двери — две пачки по 250 г.
              Можно один сорт, можно ассорти из того, что обжарили на этой
              неделе.
            </p>
            <p>
              Управлять подпиской просто: напишете нам в мессенджер — поменяем
              сорт, сдвинем дату или поставим на паузу. Без договоров и
              штрафов.
            </p>
          </div>
          <a
            href="#order"
            className="mt-8 inline-block rounded-full bg-paper px-7 py-3 font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            Хочу на подписку →
          </a>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[4/4.4]">
            <Image
              src="/coffee-bowl.jpg"
              alt="Белая посудина со свежими зернами кофе"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
