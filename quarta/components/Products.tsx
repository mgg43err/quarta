import Reveal from "./Reveal";

const products = [
  {
    name: "Эфиопия Иргачеффе",
    notes: "цветочные, бергамот",
    roast: "светлая",
    price: "32 BYN",
  },
  {
    name: "Колумбия Уила",
    notes: "карамель, красное яблоко",
    roast: "средняя",
    price: "29 BYN",
  },
  {
    name: "Бразилия Серрадо",
    notes: "орех, шоколад",
    roast: "тёмная · под эспрессо",
    price: "26 BYN",
  },
];

const extras = [
  { name: "Дрип-пакеты, ассорти — 10 штук", price: "18 BYN" },
  {
    name: "Подписка — 2 пачки 250 г раз в месяц, доставка бесплатно",
    price: "54 BYN/мес",
  },
];

export default function Products() {
  return (
    <section id="products" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            02 · что у нас есть
          </p>
          <h2 className="mt-4 font-display text-3xl md:text-4xl">
            Ассортимент
          </h2>
          <p className="mt-3 max-w-lg text-ink-soft">
            Все пачки — 250 г, зерно или помол под вашу технику. Обжарка
            прошедшая пятница или более свежая, даты указываем на каждой пачке.
          </p>
        </Reveal>

        <div className="mt-10 border-t border-line">
          {products.map((p, i) => (
            <Reveal key={p.name} delay={i * 60}>
              <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 border-b border-line py-5 md:grid-cols-[minmax(200px,300px)_1fr_auto]">
                <h3 className="font-display text-lg md:text-xl">{p.name}</h3>
                <p className="col-span-2 font-mono text-xs uppercase tracking-wider text-ink-soft md:col-span-1 md:text-sm">
                  {p.notes} · {p.roast}
                </p>
                <p className="font-mono text-base font-semibold md:text-lg">
                  {p.price}
                </p>
              </div>
            </Reveal>
          ))}
          {extras.map((e, i) => (
            <Reveal key={e.name} delay={i * 60}>
              <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 border-b border-line py-5">
                <h3 className="text-base text-ink-soft md:text-lg">{e.name}</h3>
                <p className="font-mono font-semibold">{e.price}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-6 text-sm text-ink-soft">
            Цены указаны за пачку 250 г. Названия, ноты и roast-уровень —
            честно: если не зайдёт конкретный сорт — подскажем, что взять.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
