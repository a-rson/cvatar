import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Cvatar</h1>
      <p className="text-muted-foreground max-w-md mb-10">
        Meet candidates and companies via intelligent AI-powered profiles.
        Choose your role to begin.
      </p>

      <div className="space-y-4 w-full max-w-sm">
        <Button variant="default" className="w-full">
          I’m a Recruiter – Scan or Enter Token
        </Button>
        <Button variant="outline" className="w-full">
          I’m a Client – Browse Companies
        </Button>
        <Button variant="ghost" className="w-full">
          Candidate or Company – Log In / Register
        </Button>
      </div>
    </div>
  );
}
