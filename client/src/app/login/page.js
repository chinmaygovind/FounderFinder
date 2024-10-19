import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you've added input via shadcn-ui

export default function Login() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6">Login / Signup</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <Input id="email" type="email" placeholder="you@example.com" className="w-full mt-2 p-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <Input id="password" type="password" placeholder="Enter your password" className="w-full mt-2 p-2 border border-gray-300 rounded-lg" />
          </div>
          <Button className="w-full text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg">
            Login
          </Button>
        </form>
        <p className="text-gray-600 mt-4 text-center">New user? <a href="/signup" className="text-blue-500">Sign up here</a></p>
      </div>
    </main>
  );
}
