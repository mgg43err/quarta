import Reveal from "./Reveal";

export default function OrderSection() {
  return (
    <section id="order" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
            06 · заявка
          </p>
          <h2 className="mt-4 font-display text-3xl md:text-4xl">
            Оставить заявку
          </h2>
          <p className="mt-3 max-w-lg text-ink-soft">
            Напишите пару слов — перезвоним в течение рабочего дня, ответим на
            вопросы и оформим заказ или подписку.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
