import Image from "next/image";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="border-t border-line bg-paper-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:px-8 md:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            01 · кто мы
          </p>
          <h2 className="mt-4 font-display text-3xl md:text-4xl">
            Двое и обжарочный барабан на 5 кг
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
            <p>
              Меня зовут Аня, второго — Дмитрий. До «Кварты» мы много лет
              отработали бариста в чужих кофейнях и слишком часто заваривали
              кофе, который был куплен полгода назад.
            </p>
            <p>
              Поэтому у нас просто: жарим сами, небольшими партиями по 5 кг, в
              своей мастерской на Короля, 9. В четверг — обжарка, в пятницу —
              развоз. Между обжаркой и вашей чашкой проходит несколько дней, а
              не месяцев.
            </p>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6 text-sm">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
                обжариваем с
              </dt>
              <dd className="mt-1 font-display text-2xl">2019</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
                партия
              </dt>
              <dd className="mt-1 font-display text-2xl">5 кг</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-widest text-ink-soft">
              у вас через
              </dt>
              <dd className="mt-1 font-display text-2xl">1–3 дня</dd>
            </div>
          </dl>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[4/4.2]">
            <Image
              src="/coffee-craft.jpg"
              alt="Три портафильтра: свежая обжарка, молотый кофе и латте"
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
