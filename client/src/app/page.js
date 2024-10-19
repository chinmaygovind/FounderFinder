import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to FounderFinder</h1>
      <p>Discover new connections and explore relationships between Penn students.</p>
      <Button className="mt-4" variant="default">
        Get Started
      </Button>
    </main>
  );
}
