import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Same input as above
import { Textarea } from "@/components/ui/textarea"; // For description

export default function MatchForm() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6">Find Your Co-Founder</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="idea" className="block text-gray-700">Your Idea</label>
            <Textarea id="idea" placeholder="Briefly describe your idea" className="w-full mt-2 p-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="mb-4">
            <label htmlFor="skills" className="block text-gray-700">Skills Needed</label>
            <Input id="skills" type="text" placeholder="What skills are you looking for?" className="w-full mt-2 p-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block text-gray-700">Time Commitment</label>
            <Input id="time" type="text" placeholder="How much time per week?" className="w-full mt-2 p-2 border border-gray-300 rounded-lg" />
          </div>
          <Button className="w-full text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg">
            Submit
          </Button>
        </form>
      </div>
    </main>
  );
}
