"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getPresignedUrl } from "@/lib/services/aws/s3Action";


const InputFileUpload = () => {
    const [folderName, setFolderName] = useState<string>("test-folder");
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        if (selectedFiles.length > 0) {
            setFiles(selectedFiles);
        } else {
            throw new Error("No files selected");
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            alert("Please select files to upload.");
            return;
        }

        try {
            for (const file of files) {
                const fileName = `${folderName}/${file.name}`;
                const fileType = file.type;

                const { url } = await getPresignedUrl(fileName, fileType);
                console.log("Presigned URL:", url);

                // Upload the file to S3 using the presigned URL
                const response = await fetch(url, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": fileType,
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error response:", errorText);
                    throw new Error(`Failed to upload file: ${response.statusText}`);
                }
            }
            console.log("Files uploaded successfully");
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    return (
        <div>
            <Input
                id="itemName"
                type="text"
                placeholder="Folder Name"
                className="mb-4"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
            />
            <Input
                id="fileUpload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
            />
            <Button className="mt-4" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    );
};

const TestUploadPage = () => {
    return (
        <div className="flex flex-col justify-center items-center w-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <h2 className="text-xl font-bold">Test Upload Page</h2>
                </CardHeader>
                <CardContent>
                    <InputFileUpload />
                    <p className="mt-4">This is a test page for file upload functionality.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default TestUploadPage;
