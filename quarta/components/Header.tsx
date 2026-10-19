import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="font-display text-xl tracking-wide">
          Кварта
        </Link>
        <a
          href="#order"
          className="rounded-full border border-ink px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper"
        >
          Оставить заявку
        </a>
      </div>
    </header>
  );
}
