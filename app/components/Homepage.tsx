'use client';

import { useState } from "react";
import { Upload, Briefcase, CheckCircle, AlertCircle, Sparkles, FileText, Send } from "lucide-react";

export default function Homepage() {
    const [file, setFile] = useState<File | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string>("");
    const [dragActive, setDragActive] = useState(false);
    const [submittedRole, setSubmittedRole] = useState<string>("");

    const jobRoles = [
        { value: "", label: "Select a role", icon: "💼" },
        { value: "frontend", label: "Frontend Engineer", icon: "🎨" },
        { value: "backend", label: "Backend Engineer", icon: "⚙️" },
        { value: "fullstack", label: "Fullstack Engineer", icon: "🚀" },
        { value: "devops", label: "DevOps Engineer", icon: "☁️" },
        { value: "ai_engineer", label: "AI Engineer", icon: "🤖" }
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError("");
            setSuccess(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
                setError("");
                setSuccess(false);
            } else {
                setError("Please upload a PDF file");
            }
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resume/parse`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to process your application");
            }

            // Save the role before resetting
            setSubmittedRole(selectedRole);
            setSuccess(true);
            setFile(null);
            setSelectedRole("");

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

    const getRoleLabel = (roleValue?: string) => {
        const value = roleValue || submittedRole;
        return jobRoles.find(role => role.value === value)?.label || value;
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex justify-end mb-4"> 
                        <a
                            href="/hr-dashboard"
                            className="px-4 py-2 md:px-6 md:py-2.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 text-sm md:text-base"
                        >
                            <Briefcase className="w-4 h-4" />
                            <span className="hidden sm:inline">HR Dashboard</span>
                            <span className="sm:hidden">Dashboard</span>
                        </a>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text">
                            Join Our Team
                        </h1>
                        <p className="text-lg text-gray-600">
                            Start your journey with us by submitting your application
                        </p>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    {success ? (
                        /* Success State */
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Application Received!
                            </h2>
                            <p className="text-lg text-gray-600 mb-2">
                                Thank you for applying for the <span className="font-semibold text-indigo-600">{getRoleLabel()}</span> position.
                            </p>
                            <p className="text-gray-600 mb-8">
                                Your resume has been received and will be evaluated by our team. We'll get back to you via email soon.
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Submit Another Application
                            </button>
                        </div>
                    ) : (
                        /* Application Form */
                        <div className="p-8 md:p-12">
                            <div className="space-y-8">
                                {/* Role Selection */}
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                                        <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
                                        Select Your Role
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedRole}
                                            onChange={handleRoleChange}
                                            className="w-full px-4 py-4 pr-10 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none bg-white text-gray-900 font-medium cursor-pointer hover:border-indigo-300"
                                        >
                                            {jobRoles.map((role) => (
                                                <option key={role.value} value={role.value}>
                                                    {role.icon} {role.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                                        <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                                        Upload Your Resume
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>

                                    <div
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        className={`relative border-3 border-dashed rounded-2xl transition-all duration-300 ${dragActive
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : file
                                                ? 'border-green-400 bg-green-50'
                                                : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
                                            }`}
                                    >
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />

                                        <div className="p-12 text-center">
                                            {file ? (
                                                <div className="space-y-4">
                                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setFile(null);
                                                            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                                                            if (fileInput) fileInput.value = '';
                                                        }}
                                                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                                    >
                                                        Change file
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full">
                                                        <Upload className="w-8 h-8 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-semibold text-gray-900">
                                                            Drop your resume here
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            or click to browse (PDF only)
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-start p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-pulse">
                                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-red-800">Error</p>
                                            <p className="text-sm text-red-700 mt-1">{error}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleUpload}
                                    disabled={!file || !selectedRole || loading}
                                    className="w-full px-6 py-5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg
                                        disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                                        hover:from-blue-700 hover:to-indigo-700 transition-all duration-200
                                        shadow-lg hover:shadow-xl disabled:shadow-none
                                        flex items-center justify-center group relative overflow-hidden"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing Application...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                                            Submit Application
                                        </>
                                    )}
                                </button>

                                {/* Info Box */}
                                <div className="p-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                                        What happens next?
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start">
                                            <span className="inline-block w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-3 shrink-0"></span>
                                            <span>Our AI system will analyze your resume and qualifications</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-block w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-3 shrink-0"></span>
                                            <span>Our HR team will review the evaluation results</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-block w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 mr-3 shrink-0"></span>
                                            <span>You'll receive an update within 3-5 business days</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-8">
                    By submitting your application, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}