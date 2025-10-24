export interface CleanResumeData {
    candidateName: {
        firstName: string;
        familyName: string;
    };
    email: string[];
    phoneNumber: string[];
    website: string[];
    summary: string;
    totalYearsExperience: number;
    workExperience: WorkExperience[];
    education: Education[];
    project: Project[];
    skill: Skill[];
}

export interface WorkExperience {
    jobTitle: string;
    organization: string;
    location: string;
    dates: {
        start: string;
        end: string;
        isCurrent: boolean;
        durationInMonths: number;
    };
    description: string;
    type: string;
}

export interface Education {
    accreditation: string;
    level: string;
    dates: {
        endDate: string;
        year: number;
    };
    grade: {
        score: number;
        unit: string;
    };
}

export interface Project {
    title: string;
    description: string;
    type: string;
}

export interface Skill {
    name: string;
    type: string;
    category: string;
    subCategory: string;
}

// Add to your existing types
export interface CandidateEvaluation {
    overallScore: number;
    roleSuitability: {
        role: string;
        score: number;
        reasoning: string;
    }[];
    strengths: string[];
    weaknesses: string[];
    skillGaps: string[];
    recommendation: 'strong' | 'moderate' | 'weak';
    evaluationSummary: string;
}

export interface CleanResumeData {
    candidateName: {
        firstName: string;
        familyName: string;
    };
    email: string[];
    phoneNumber: string[];
    website: string[];
    summary: string;
    totalYearsExperience: number;
    workExperience: WorkExperience[];
    education: Education[];
    project: Project[];
    skill: Skill[];
    evaluation?: CandidateEvaluation; // Optional evaluation field
}