"use client"; // This enables Client Component behavior
import { Button } from "@/components/ui/button"; // Make sure the button is installed via shadcn-ui

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold mb-4">Welcome to FounderFinder</h1>
        <p className="text-lg text-gray-600 mb-6">
          Connecting Penn students with the right co-founder to turn their ideas into reality.
        </p>
        <Button
          className="text-white bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-6 rounded-lg"
          onClick={() => window.location.href = "/login"}
        >
          Login / Signup
        </Button>
        <Button
          className="text-white bg-green-600 hover:bg-green-700 font-semibold py-2 px-6 rounded-lg"
          onClick={() => window.location.href = "/match"}
        >
          Find a Co-Founder
        </Button>
      </div>
    </main>
  );
}
