import Reveal from "./Reveal";

export default function Contacts() {
  return (
    <section id="contacts" className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div className="border-y border-line py-10 md:py-14">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-[160px_1fr]">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
              05 · контакты
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-display text-xl">Связаться напрямую</h3>
                <ul className="mt-3 space-y-1 text-ink-soft">
                  <li>телефон: +375 (29) 000-00-00</li>
                  <li>Telegram / WhatsApp: там же</li>
                  <li>почта: hello@quarta.coffee</li>
                </ul>
              </div>
              <div>
                <h3 className="font-display text-xl">Мастерская</h3>
                <ul className="mt-3 space-y-1 text-ink-soft">
                  <li>Минск, ул. Короля, 9</li>
                  <li>пн–пт 8:00–20:00, сб–вс 10:00–18:00</li>
                  <li>самовывоз — в любое рабочее время</li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
