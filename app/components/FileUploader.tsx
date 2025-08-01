import {useCallback, useState} from 'react'
import {useDropzone} from "react-dropzone";
import {formatSize} from "../lib/utils";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const FileUploader = ({onFileSelect}: FileUploaderProps ) => {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect])

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple: false,
        accept: {'application/pdf': [".pdf"]},
        maxSize: MAX_FILE_SIZE
    });

    const file = acceptedFiles[0] || null;

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <img
                                alt="pdf"
                                src="/images/pdf.png"
                                className="size-10"
                            />

                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>

                            <button className="p-2 cursor-pointer" onClick={(e) => {
                                onFileSelect?.(null);
                            }}>
                                <img
                                    src="/icons/cross.svg"
                                    alt="remove"
                                    className="w-4 h-4"
                                />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center">
                                <img
                                    alt="upload"
                                    src="/icons/info.svg"
                                    className="size-20"
                                />
                            </div>

                            <div className="flex flex-col items-center">
                                <p className="text-lg text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop files here
                                </p>
                                <p className="text-lg text-gray-500">
                                    PDF (max {formatSize(MAX_FILE_SIZE)})
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
