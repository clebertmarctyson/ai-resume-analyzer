import type { Route } from "./+types/home";
import NavBar from "~/components/NavBar";
import {resumes} from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedbacks for your dream job" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/")
  }, [auth.isAuthenticated])


  return (<main className="bg-[url('/images/bg-main.svg')] bg-cover flex flex-col gap-4">
    <NavBar />

    <section className="main-section">
      <div className="page-heading py-8">
        <h1>Track Your Applications & Resume Ratings</h1>
        <h2>Review your submissions and check AI-powered feedback.</h2>
      </div>
    </section>

    {resumes?.length > 0 && (
        <section className="resumes-section py-8">
          {resumes.map(resume => <ResumeCard key={resume.id} resume={resume} />)}
        </section>
    )}
  </main>)
}
