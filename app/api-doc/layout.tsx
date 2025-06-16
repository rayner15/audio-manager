import Link from "next/link";

export default function ApiDocLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="bg-slate-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Audio World API</h1>
          <Link href="/" className="hover:underline">
            Back to App
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
