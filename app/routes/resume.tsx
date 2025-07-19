import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from "react-router";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => {
    return [
        { title: "Resumind | Preview Resume" },
        { name: "description", description: "Detailed Overview Of Your Resume" }
    ]
}

type ResumeDataType = {
    id: string;
    resumePath: string;
    imagePath: string;
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    feedback?: Feedback;
    file?: File | null;
}

const Resume = () => {
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const navigate = useNavigate();

    const { id }  = useParams();

    const { auth, isLoading, fs, kv } = usePuterStore();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading, auth.isAuthenticated])


    useEffect(() => {
        const loadResume = async  () => {

            const resume = await kv.get(`resume:${id}`);

            if (!resume) return;

            const data = JSON.parse(resume) as ResumeDataType;

            const resumeBlob = await fs.read(data.resumePath);

            if (!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'});
            const resumeUrl = URL.createObjectURL(pdfBlob);

            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);

            if (!imageBlob) return;

            const imageUrl = URL.createObjectURL(imageBlob);

            setImageUrl(imageUrl);

            setFeedback(data.feedback!);
        }

        (async () => await loadResume())();
    }, [id]);

    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to={"/"} className={"back-button"}>
                    <img
                        alt={"Logo"}
                        src={"/icons/back.svg"}
                        className="w-2.5 h-2.5"
                    />
                    <span className={"text-gray-800 text-sm font-semibold"}>Back To Home Page</span>
                </Link>
            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-xl:h-fit w-fit">
                            <a href={imageUrl} target={'_blank'} rel="noopener noreferrer">
                              <img
                                  alt={"resume"}
                                  src={imageUrl}
                                  className={"w-full h-full object-contain rounded-2xl"}
                              />
                            </a>
                        </div>
                    )}
                </section>

                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ):(
                        <img
                            alt="resume-search"
                            src="/images/resume-scan-2.gif"
                            className="w-full"
                        />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume
