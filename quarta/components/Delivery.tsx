import Image from "next/image";
import Reveal from "./Reveal";

export default function Delivery() {
  return (
    <section id="delivery" className="border-t border-line bg-paper-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            04 · доставка и самовывоз
          </p>
          <div className="mt-6 grid gap-8">
            <div className="border-l-2 border-accent pl-5">
              <h3 className="font-display text-xl">Доставка по Минску</h3>
              <p className="mt-2 text-ink-soft">
                Каждую пятницу развозим заказы по городу. От 50 BYN —
                бесплатно, до этой суммы — договоримся при подтверждении.
              </p>
            </div>
            <div className="border-l-2 border-line pl-5">
              <h3 className="font-display text-xl">Самовывоз</h3>
              <p className="mt-2 text-ink-soft">
                Забрать самим можно прямо из мастерской — заодно понюхаете,
                что мы жарили на этой неделе.
              </p>
            </div>
            <div className="font-mono text-sm uppercase tracking-wider text-ink-soft">
              <p>мастерская: Минск, ул. Короля, 9</p>
              <p className="mt-1">пн–пт 8:00–20:00 · сб–вс 10:00–18:00</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-auto md:h-full md:min-h-[360px]">
            <Image
              src="/coffee-morning.jpg"
              alt="Рука с белой кружкой дымящегося кофе утром у окна"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
