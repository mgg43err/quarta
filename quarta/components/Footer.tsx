export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-ink-soft md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-display text-base text-ink">Кварта</p>
        <p className="font-mono text-xs uppercase tracking-widest">
          обжарка по четвергам · развоз по пятницам
        </p>
        <p>© 2026 · Минск</p>
      </div>
    </footer>
  );
}
