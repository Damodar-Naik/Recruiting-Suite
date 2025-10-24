// FILE: app/hr-dashboard/page.tsx - CREATE NEW FILE

'use client';

import { useState, useEffect } from 'react';

interface Candidate {
    id: number;
    firstName: string;
    familyName: string;
    email: string;
    phone: string;
    summary: string;
    totalYearsExperience: number;
    appliedRole: string;
    overallScore: number;
    recommendation: string;
    onboardingStage: string;
    evaluation?: any;
    rawData: any;
    createdAt: string;
}

const stages = [
    { id: 'new', title: 'New Applications' },
    { id: 'reviewing', title: 'Reviewing' },
    { id: 'decision', title: 'Decision' }
];

const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'frontend', label: 'Frontend Engineer' },
    { value: 'backend', label: 'Backend Engineer' },
    { value: 'fullstack', label: 'Fullstack Engineer' },
    { value: 'devops', label: 'DevOps Engineer' },
    { value: 'ai_engineer', label: 'AI Engineer' }
];

export default function HRDashboard() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedRole, setSelectedRole] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);

    useEffect(() => {
        fetchCandidates();
    }, [selectedRole]);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/candidates?role=${selectedRole}`);
            const data = await response.json();
            setCandidates(data.candidates);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateCandidateStage = async (candidateId: number, newStage: string) => {
        try {
            const response = await fetch('/api/candidates', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: candidateId, onboardingStage: newStage })
            });

            if (response.ok) {
                // Update local state
                setCandidates(prev =>
                    prev.map(c => c.id === candidateId ? { ...c, onboardingStage: newStage } : c)
                );
            }
        } catch (error) {
            console.error('Error updating candidate:', error);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return 'bg-green-100 text-green-800 border-green-300';
        if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        return 'bg-red-100 text-red-800 border-red-300';
    };

    const handleDragStart = (e: React.DragEvent, candidate: Candidate) => {
        setDraggedCandidate(candidate);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, newStage: string) => {
        e.preventDefault();
        if (draggedCandidate && draggedCandidate.onboardingStage !== newStage) {
            updateCandidateStage(draggedCandidate.id, newStage);
        }
        setDraggedCandidate(null);
    };

    const getCandidatesByStage = (stageId: string) => {
        return candidates.filter(c => c.onboardingStage === stageId);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">HR Dashboard</h1>
                    <p className="text-gray-600">Manage candidate applications</p>
                </div>

                {/* Filter */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter by Role
                    </label>
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {roleOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <span className="ml-4 text-sm text-gray-600">
                        {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Kanban Board */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">Loading candidates...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-6">
                        {stages.map(stage => (
                            <div
                                key={stage.id}
                                className="bg-gray-100 rounded-lg p-4"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, stage.id)}
                            >
                                {/* Stage Header */}
                                <div className="mb-4">
                                    <h2 className="font-semibold text-gray-800">{stage.title}</h2>
                                    <span className="text-sm text-gray-600">
                                        {getCandidatesByStage(stage.id).length} candidates
                                    </span>
                                </div>

                                {/* Candidate Cards */}
                                <div className="space-y-3">
                                    {getCandidatesByStage(stage.id).map(candidate => (
                                        <div
                                            key={candidate.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, candidate)}
                                            onClick={() => setSelectedCandidate(candidate)}
                                            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                                        >
                                            <h3 className="font-medium text-gray-900">
                                                {candidate.firstName} {candidate.familyName}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {candidate.appliedRole}
                                            </p>
                                            <div className="flex items-center justify-between mt-3">
                                                <span className={`text-xs px-2 py-1 rounded-full border ${getScoreColor(candidate.overallScore)}`}>
                                                    Score: {candidate.overallScore}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(candidate.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {getCandidatesByStage(stage.id).length === 0 && (
                                        <div className="text-center py-8 text-gray-400 text-sm">
                                            No candidates
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Candidate Detail Modal */}
                {selectedCandidate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                                <h2 className="text-2xl font-bold">
                                    {selectedCandidate.firstName} {selectedCandidate.familyName}
                                </h2>
                                <button
                                    onClick={() => setSelectedCandidate(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Contact Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Email:</strong> {selectedCandidate.email}</p>
                                        <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
                                        <p><strong>Applied Role:</strong> {selectedCandidate.appliedRole}</p>
                                        <p><strong>Applied On:</strong> {new Date(selectedCandidate.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Evaluation */}
                                {selectedCandidate.evaluation && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">AI Evaluation</h3>
                                        <div className="bg-gray-50 p-4 rounded space-y-3">
                                            <div>
                                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(selectedCandidate.overallScore)}`}>
                                                    Overall Score: {selectedCandidate.overallScore}/100
                                                </span>
                                                <span className="ml-2 text-sm text-gray-600">
                                                    ({selectedCandidate.recommendation})
                                                </span>
                                            </div>

                                            <div>
                                                <strong className="text-sm">Summary:</strong>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    {selectedCandidate.evaluation.evaluationSummary}
                                                </p>
                                            </div>

                                            {selectedCandidate.evaluation.strengths?.length > 0 && (
                                                <div>
                                                    <strong className="text-sm">Strengths:</strong>
                                                    <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                                                        {selectedCandidate.evaluation.strengths.map((s: string, i: number) => (
                                                            <li key={i}>{s}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {selectedCandidate.evaluation.weaknesses?.length > 0 && (
                                                <div>
                                                    <strong className="text-sm">Weaknesses:</strong>
                                                    <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                                                        {selectedCandidate.evaluation.weaknesses.map((w: string, i: number) => (
                                                            <li key={i}>{w}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Summary */}
                                {selectedCandidate.summary && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Professional Summary</h3>
                                        <p className="text-sm text-gray-700">{selectedCandidate.summary}</p>
                                    </div>
                                )}

                                {/* Experience */}
                                {selectedCandidate.rawData?.workExperience?.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Work Experience</h3>
                                        <div className="space-y-4">
                                            {selectedCandidate.rawData.workExperience.map((exp: any, i: number) => (
                                                <div key={i} className="border-l-2 border-gray-300 pl-4">
                                                    <h4 className="font-medium">{exp.jobTitle}</h4>
                                                    <p className="text-sm text-gray-600">{exp.organization}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {exp.dates.start} - {exp.dates.isCurrent ? 'Present' : exp.dates.end}
                                                    </p>
                                                    {exp.description && (
                                                        <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {selectedCandidate.rawData?.education?.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                                        <div className="space-y-2">
                                            {selectedCandidate.rawData.education.map((edu: any, i: number) => (
                                                <div key={i}>
                                                    <p className="font-medium">{edu.accreditation}</p>
                                                    <p className="text-sm text-gray-600">{edu.level}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills */}
                                {selectedCandidate.rawData?.skill?.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCandidate.rawData.skill.map((skill: any, i: number) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                >
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}