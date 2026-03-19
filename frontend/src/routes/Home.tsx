import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Fake<span className="text-accent">X</span>change
      </h1>
      <Link
        to="/trade/TESTUSD"
        className="px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors"
      >
        Start Trading
      </Link>
    </div>
  );
}
