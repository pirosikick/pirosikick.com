import Link from "next/link";

export default function Header() {
  return (
    <h2 className="text-2xl font-bold tracking-tight leading-tight mb-20 mt-8">
      <Link href="/">
        <a className="hover:underline">🍺👨🏻‍💻🍳 pirosikick.com</a>
      </Link>
    </h2>
  );
}
