'use client';

import { useState, useEffect } from 'react';
import { Users, Briefcase, TrendingUp, Award, Mail, Phone, Calendar, Star, X, ChevronRight, Filter } from 'lucide-react';

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
    { id: 'new', title: 'New Applications', color: 'blue', icon: '📥' },
    { id: 'reviewing', title: 'Under Review', color: 'yellow', icon: '👀' },
    { id: 'decision', title: 'Decision Stage', color: 'purple', icon: '✅' }
];

const roleOptions = [
    { value: 'all', label: 'All Roles', icon: '💼' },
    { value: 'frontend', label: 'Frontend Engineer', icon: '🎨' },
    { value: 'backend', label: 'Backend Engineer', icon: '⚙️' },
    { value: 'fullstack', label: 'Fullstack Engineer', icon: '🚀' },
    { value: 'devops', label: 'DevOps Engineer', icon: '☁️' },
    { value: 'ai_engineer', label: 'AI Engineer', icon: '🤖' }
];

export default function HRDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedRole, setSelectedRole] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);
    const [dragOverStage, setDragOverStage] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCandidates();
        }
    }, [selectedRole, isAuthenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hr/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store auth token (not password!)
                localStorage.setItem('hrAuthToken', data.token);
                setIsAuthenticated(true);
                setAuthError('');
            } else {
                setAuthError('Invalid password');
            }
        } catch (error) {
            setAuthError('Authentication failed');
        }
    };

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hr/candidates?role=${selectedRole}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' , authorization: `Bearer ${localStorage.getItem('hrAuthToken')}` },
            });
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hr/${candidateId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ onboardingStage: newStage })
            });

            if (response.ok) {
                setCandidates(prev =>
                    prev.map(c => c.id === candidateId ? { ...c, onboardingStage: newStage } : c)
                );
            }
        } catch (error) {
            console.error('Error updating candidate:', error);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return 'from-green-500 to-emerald-500';
        if (score >= 50) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-rose-500';
    };

    const getScoreBadgeColor = (score: number) => {
        if (score >= 75) return 'bg-green-100 text-green-700 border-green-200';
        if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-red-100 text-red-700 border-red-200';
    };

    const handleDragStart = (e: React.DragEvent, candidate: Candidate) => {
        setDraggedCandidate(candidate);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, stageId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverStage(stageId);
    };

    const handleDragLeave = () => {
        setDragOverStage(null);
    };

    const handleDrop = (e: React.DragEvent, newStage: string) => {
        e.preventDefault();
        if (draggedCandidate && draggedCandidate.onboardingStage !== newStage) {
            updateCandidateStage(draggedCandidate.id, newStage);
        }
        setDraggedCandidate(null);
        setDragOverStage(null);
    };

    const getCandidatesByStage = (stageId: string) => {
        return candidates.filter(c => c.onboardingStage === stageId);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStats = () => {
        const numberOfcandidates = candidates?.length;
        return {
            total: numberOfcandidates,
            avgScore: numberOfcandidates > 0
                ? Math.round(candidates.reduce((sum, c) => sum + c.overallScore, 0) / numberOfcandidates)
                : 0,
            highScorers: candidates.filter(c => c.overallScore >= 75)?.length || 0
        };
    };

    const stats = getStats();

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-2 bg-opacity-20 rounded-2xl mb-4">
                                <Users className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">HR Dashboard</h1>
                            <p className="text-blue-100">Secure Access Portal</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="p-8">
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setAuthError('');
                                    }}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    autoFocus
                                />
                            </div>

                            {authError && (
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                    <p className="text-sm text-red-700 flex items-center gap-2">
                                        <span className="text-red-500">⚠️</span>
                                        {authError}
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                                disabled={!password}
                            >
                                Access Dashboard
                            </button>

                            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                <p className="text-xs text-gray-600 text-center">
                                    🔒 This is a secure area. Only authorized HR personnel can access this dashboard.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
                            <p className="text-gray-600">Manage and track candidate applications</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Candidates</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Average Score</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.avgScore}/100</p>
                                </div>
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">High Performers</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.highScorers}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Award className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="mb-6 bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Filter className="w-5 h-5 text-gray-400 shrink-0" />
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                                Filter by Role
                            </label>
                        </div>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="flex-1 sm:flex-initial sm:min-w-[200px] px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        >
                            {roleOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.icon} {option.label}
                                </option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-500 sm:ml-auto">
                            Showing {candidates?.length || 0} candidate{candidates?.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>

                {/* Kanban Board */}
                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading candidates...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {stages.map(stage => {
                            const stageCandidates = getCandidatesByStage(stage.id);
                            const isDragOver = dragOverStage === stage.id;

                            return (
                                <div
                                    key={stage.id}
                                    className={`bg-white rounded-2xl shadow-sm border-2 transition-all ${isDragOver
                                        ? 'border-indigo-400 bg-indigo-50 scale-105'
                                        : 'border-gray-100'
                                        }`}
                                    onDragOver={(e) => handleDragOver(e, stage.id)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, stage.id)}
                                >
                                    {/* Stage Header */}
                                    <div className="p-5 border-b border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{stage.icon}</span>
                                                <h2 className="font-bold text-gray-900">{stage.title}</h2>
                                            </div>
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                                                {stageCandidates?.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Candidate Cards */}
                                    <div className="p-4 space-y-3 min-h-[400px]">
                                        {stageCandidates?.map(candidate => (
                                            <div
                                                key={candidate.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, candidate)}
                                                onClick={() => setSelectedCandidate(candidate)}
                                                className="bg-linear-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-lg hover:scale-105 transition-all group"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                            {candidate.firstName} {candidate.familyName}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                            <Briefcase className="w-3 h-3" />
                                                            {candidate.appliedRole}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`relative w-12 h-12 rounded-lg bg-linear-to-br ${getScoreColor(candidate.overallScore)} flex items-center justify-center shadow-md`}>
                                                            <span className="text-white font-bold text-sm">{candidate.overallScore}</span>
                                                        </div>
                                                        {candidate.overallScore >= 75 && (
                                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(candidate.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}

                                        {stageCandidates?.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <Users className="w-10 h-10 text-gray-300" />
                                                </div>
                                                <p className="text-gray-400 text-sm">No candidates yet</p>
                                                <p className="text-gray-300 text-xs mt-1">Drag cards here</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Candidate Detail Modal */}
                {selectedCandidate && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {selectedCandidate.firstName} {selectedCandidate.familyName}
                                    </h2>
                                    <p className="text-blue-100 text-sm mt-1 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        {selectedCandidate.appliedRole}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedCandidate(null)}
                                    className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8 space-y-6">
                                {/* Score Card */}
                                <div className={`rounded-2xl p-6 bg-linear-to-br ${getScoreColor(selectedCandidate.overallScore)} text-white shadow-lg`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white text-opacity-90 text-sm mb-1">Overall Score</p>
                                            <p className="text-5xl font-bold">{selectedCandidate.overallScore}<span className="text-2xl">/100</span></p>
                                            <p className="text-white text-opacity-90 mt-2 capitalize">{selectedCandidate.recommendation}</p>
                                        </div>
                                        <Award className="w-20 h-20 text-white opacity-20" />
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-indigo-600" />
                                        Contact Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedCandidate.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Phone</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedCandidate.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Applied On</p>
                                                <p className="text-sm font-medium text-gray-900">{formatDate(selectedCandidate.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                                <Briefcase className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Experience</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedCandidate.totalYearsExperience} years</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Evaluation */}
                                {selectedCandidate.evaluation && (
                                    <div className="bg-white rounded-2xl p-6 border-2 border-indigo-100">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            🤖 AI Evaluation
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="bg-indigo-50 rounded-xl p-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Summary</p>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {selectedCandidate.evaluation.evaluationSummary}
                                                </p>
                                            </div>

                                            {selectedCandidate.evaluation.strengths?.length > 0 && (
                                                <div className="bg-green-50 rounded-xl p-4">
                                                    <p className="text-sm font-medium text-green-900 mb-2">✨ Strengths</p>
                                                    <ul className="space-y-1">
                                                        {selectedCandidate.evaluation.strengths.map((s: string, i: number) => (
                                                            <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                                                                <span className="text-green-500 mt-0.5">•</span>
                                                                <span>{s}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {selectedCandidate.evaluation.weaknesses?.length > 0 && (
                                                <div className="bg-orange-50 rounded-xl p-4">
                                                    <p className="text-sm font-medium text-orange-900 mb-2">⚠️ Areas for Improvement</p>
                                                    <ul className="space-y-1">
                                                        {selectedCandidate.evaluation.weaknesses.map((w: string, i: number) => (
                                                            <li key={i} className="text-sm text-orange-800 flex items-start gap-2">
                                                                <span className="text-orange-500 mt-0.5">•</span>
                                                                <span>{w}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Professional Summary */}
                                {selectedCandidate.summary && (
                                    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-3">Professional Summary</h3>
                                        <p className="text-sm text-gray-700 leading-relaxed">{selectedCandidate.summary}</p>
                                    </div>
                                )}

                                {/* Work Experience */}
                                {selectedCandidate.rawData?.workExperience?.length > 0 && (
                                    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-4">Work Experience</h3>
                                        <div className="space-y-4">
                                            {selectedCandidate.rawData.workExperience.map((exp: any, i: number) => (
                                                <div key={i} className="relative pl-6 pb-4 border-l-2 border-indigo-200 last:border-l-0 last:pb-0">
                                                    <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
                                                    <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                                                    <p className="text-sm text-indigo-600 font-medium">{exp.organization}</p>
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {exp.dates.start} - {exp.dates.isCurrent ? 'Present' : exp.dates.end}
                                                    </p>
                                                    {exp.description && (
                                                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {selectedCandidate.rawData?.education?.length > 0 && (
                                    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-4">Education</h3>
                                        <div className="space-y-3">
                                            {selectedCandidate.rawData.education.map((edu: any, i: number) => (
                                                <div key={i} className="bg-gray-50 rounded-xl p-4">
                                                    <p className="font-semibold text-gray-900">{edu.accreditation}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{edu.level}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skills */}
                                {selectedCandidate.rawData?.skill?.length > 0 && (
                                    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-4">Skills & Technologies</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCandidate.rawData.skill.map((skill: any, i: number) => (
                                                skill?.name?.trim() && <span
                                                    key={i}
                                                    className="px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100 hover:border-indigo-300 transition-colors"
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