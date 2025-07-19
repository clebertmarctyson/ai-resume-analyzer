import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, fs, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        (async () => await loadFiles())()
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {

        for (const file of files) {
            await fs.delete(file.path);
        }

        await kv.flush();

        await loadFiles();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error {error}</div>;
    }

    return (
        <div className="flex flex-col gap-8 p-8 w-full">
            Authenticated as: {auth.user?.username}
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold">Existing files:</h3>

                {files.map((file) => (
                    <div key={file.id} className="flex flex-row gap-4">
                        <p>{file.name}</p>
                    </div>
                ))}
            </div>
            <div className="flex gap-4">
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
                    onClick={() => handleDelete()}
                >
                    Wipe App Data
                </button>

                <Link to={"/"} className={"back-button"}>
                    <img
                        alt={"Logo"}
                        src={"/icons/back.svg"}
                        className="w-2.5 h-2.5"
                    />
                    <span className={"text-gray-800 text-sm font-semibold"}>Back To Home Page</span>
                </Link>
            </div>
        </div>
    );
};

export default WipeApp;