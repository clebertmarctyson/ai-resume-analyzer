import type { Route } from "./+types/home";
import NavBar from "~/components/NavBar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedbacks for your dream job" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/")
  }, [auth.isAuthenticated]);


  useEffect(() => {
    const loadResumes = async  () => {
      setIsLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[]

      const parsedResumes = resumes?.map((resume) => {
        return JSON.parse(resume.value) as Resume
      });

      setResumes(parsedResumes);
      setIsLoadingResumes(false);
    };

    (async () => await loadResumes())();
  }, []);

  return (<main className="bg-[url('/images/bg-main.svg')] bg-cover flex flex-col gap-4">
    <NavBar />

    <section className="main-section">
      <div className="page-heading py-8">
        <h1>Track Your Applications & Resume Ratings</h1>

        {!isLoadingResumes && resumes?.length === 0 ? (
            <h2>No Resumes Found. Upload You First Resume To Get Feedback.</h2>
        ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
        )}
      </div>
    </section>

    {isLoadingResumes && (
        <div className="flex flex-col items-center justify-center">
          <img
              alt="search-resume-1"
              src="/images/resume-scan-2.gif"
              className="w-[200px]"
          />
        </div>
    )}

    {!isLoadingResumes && resumes?.length > 0 && (
        <section className="resumes-section py-8">
          {resumes.map(resume => <ResumeCard key={resume.id} resume={resume} />)}
        </section>
    )}

    {!isLoadingResumes && resumes?.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <Link to={"/upload"} className="primary-button w-fit text-xl font-semibold">
            Upload Resume
          </Link>
        </div>
    )}
  </main>)
}
