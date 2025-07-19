import React, {useEffect, useState} from 'react'
import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import {usePuterStore} from "~/lib/puter";

const ResumeCard = ({resume}: {resume: Resume}) => {
    const { fs } = usePuterStore()
    const [resumeUrl, setResumeUrl] = useState<string>();
    const {id, companyName, jobTitle, imagePath, feedback} = resume;

    useEffect(() => {
        const loadReasume = async () => {
            const blob = await fs.read(imagePath)

            if (!blob) return;

            const url = URL.createObjectURL(blob);

            setResumeUrl(url);
        }

        (async () => await loadReasume())();

    }, [imagePath]);

    return (
        <Link to={`/resume/${resume.id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2 ">
                    <h2 className="!text-black font-bold break-words">{companyName}</h2>
                    <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            {resumeUrl && (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <div className="w-full h-full">
                        <img
                            alt={jobTitle}
                            src={resumeUrl}
                            className="w-full h-[350px] max-sm:h-[250px] object-cover object-top"
                        />
                    </div>
                </div>
            )}
        </Link>
    )
}
export default ResumeCard
