import React, {useState} from 'react'
import NavBar from "~/components/NavBar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {convertPdfToImage} from "~/lib/pdfToImage";
import {generateUUID} from "~/utils"
import {prepareInstructions} from "../../constants";
import {useNavigate} from "react-router";

type ResumeData = {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File
}

const Upload = () => {
    const navigate = useNavigate();
    const {auth, isLoading, fs, ai, kv} = usePuterStore()
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyse = async (resumeData: ResumeData) => {

        const { companyName, jobTitle, jobDescription} = resumeData;

        setIsProcessing(true);

        setStatusText("Uploading the pdf file...");

        const uploadedFile = await fs.upload([file as File]);

        if (!uploadedFile) return setStatusText("Error: Failed to upload the pdf file!");

        setStatusText("Converting to image...");

        const imageFile = await convertPdfToImage(file as File);

        if (!imageFile) return setStatusText("Error: Failed to convert pdf to image!");

        setStatusText("Uploading the image...");

        const uploadedImage = await fs.upload([imageFile.file as File]);

        if (!uploadedImage) return setStatusText("Error: Failed to upload the image!");

        setStatusText("Preparing data...");

        const uuid = await generateUUID();

        const data ={
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: ''
        }

        await kv.set(`resume:${data.id}`, JSON.stringify(data));

        setStatusText("Analyzing...");

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle, jobDescription})
        );

        if (!feedback) return setStatusText("Error: Failed to analyze resume!");

        const feedbackText = typeof feedback.message.content === "string" ?
            feedback.message.content :
            feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);

        await kv.set(`resume:${data.id}`, JSON.stringify(data));

        setStatusText("Analisis complete! Redirecting...");

        console.log(data);

        setIsProcessing(false);

        // navigate("/");
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget.closest("form");

        if (!form) return;

        const formData = new FormData(form);

        // const { get } = formData;

        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;

        if (!file) return;

        await handleAnalyse({companyName, jobTitle, jobDescription, file})
    }


    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover flex flex-col gap-4">
            <NavBar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h1>{statusText}</h1>
                            <img
                                src="/images/resume-scan.gif"
                                alt="Resume Scan"
                                className="w-full"
                            />
                        </>
                    ) : (
                        <>
                            <h2>Drop Your Resume For An ATS score and improvement tips</h2>
                        </>
                    )}

                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" id="company-name" name="company-name" placeholder="Company Name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" id="job-title" name="job-title" placeholder="Job Title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} id="job-description" name="job-description" placeholder="Job Description" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button type="submit" className="primary-button">
                                Analyse Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
