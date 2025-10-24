// FILE: app\components\Homepage.tsx
'use client';

import { useState } from "react";

export default function Homepage() {
    const [file, setFile] = useState<File | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string>("");

    const jobRoles = [
        { value: "", label: "Select a role" },
        { value: "frontend", label: "Frontend Engineer" },
        { value: "backend", label: "Backend Engineer" },
        { value: "fullstack", label: "Fullstack Engineer" },
        { value: "devops", label: "DevOps Engineer" },
        { value: "ai_engineer", label: "AI Engineer" }
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError("");
            setSuccess(false);
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(e.target.value);
        setError("");
        setSuccess(false);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a resume file");
            return;
        }

        if (!selectedRole) {
            setError("Please select a role you are applying for");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess(false);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("jobRole", selectedRole);

        try {
            const response = await fetch("/api/parse-resume", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to process your application");
            }

            // Show success message
            setSuccess(true);
            // Reset form
            setFile(null);
            setSelectedRole("");

            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while processing your application");
        } finally {
            setLoading(false);
        }
    };

    const getRoleLabel = () => {
        return jobRoles.find(role => role.value === selectedRole)?.label || selectedRole;
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">Job Application</h1>
            <p className="text-gray-600 mb-6">Submit your resume for evaluation</p>

            <div className="space-y-6">
                {/* Success Message */}
                {success && (
                    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                            <div className="shrink-0">
                                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-green-800">
                                    Thank You for Your Application!
                                </h3>
                                <div className="mt-2 text-green-700">
                                    <p>
                                        Thank you for applying for the <strong>{getRoleLabel()}</strong> position.
                                        Your resume has been received and will be evaluated by our team.
                                    </p>
                                    <p className="mt-2">
                                        We will review your application and update you accordingly via email.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Application Form - Only show when not successful */}
                {!success && (
                    <>
                        {/* Role Selection - Required */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Position you are applying for <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedRole}
                                onChange={handleRoleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {jobRoles.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* File Upload - Required */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload your resume <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                        </div>

                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            disabled={!file || !selectedRole || loading}
                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-md
                                disabled:bg-gray-300 disabled:cursor-not-allowed
                                hover:bg-blue-700 transition-colors duration-200
                                font-medium text-base"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing your application...
                                </div>
                            ) : (
                                "Submit Application"
                            )}
                        </button>

                        {/* Error Display */}
                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-medium">Error</span>
                                </div>
                                <p className="mt-1">{error}</p>
                            </div>
                        )}
                    </>
                )}

                {/* Additional Info */}
                {!success && (
                    <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                        <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Our AI system will analyze your resume and qualifications</li>
                            <li>• Our HR team will review the evaluation results</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}