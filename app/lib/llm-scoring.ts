// FILE: app\lib\llm-scoring.ts

import { GoogleGenAI } from "@google/genai";
import { CleanResumeData } from "@/app/types/resume";

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

export async function evaluateCandidateWithLLM(
    candidateData: CleanResumeData,
    jobDescription?: string
): Promise<CandidateEvaluation> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!jobDescription) {
        throw new Error("Job Description is required for evaluation");
    }
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY not configured");
    }

    if (!process.env.GEMINI_MODEL) {
        throw new Error("GEMINI_MODEL not configured");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = createEvaluationPrompt(candidateData, jobDescription);

    try {
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL, // or "gemini-2.5-flash" for newer models
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.1,
            }
        });

        // Add proper type checking for response.text
        if (!response.text) {
            throw new Error("Empty response from Gemini API");
        }

        return JSON.parse(response.text) as CandidateEvaluation;
    } catch (error) {
        console.error("Gemini API error:", error);
        throw new Error("Failed to evaluate candidate with Gemini");
    }
}

function createEvaluationPrompt(candidateData: CleanResumeData, jobDescription?: string): string {
    const basePrompt = `
You are an expert HR recruiter with 20 years of experience. Analyze the candidate's resume and provide a comprehensive evaluation.

CANDIDATE DATA:
${JSON.stringify(candidateData, null, 2)}

${jobDescription ? `
JOB DESCRIPTION:
${jobDescription}

Please evaluate the candidate specifically for this role.` : 'Please evaluate the candidate for general technical roles.'}

EVALUATION CRITERIA:
- Skills match and relevance
- Years of experience
- Education background
- Project complexity and scope
- Career progression

RESPONSE FORMAT:
You MUST return a valid JSON object with this exact structure:
{
    "overallScore": 85,
    "roleSuitability": [
        {
            "role": "Software Engineer",
            "score": 85,
            "reasoning": "Strong programming background but limited cloud experience"
        }
    ],
    "strengths": ["JavaScript", "React", "5 years experience"],
    "weaknesses": ["No cloud experience", "Limited leadership"],
    "skillGaps": ["AWS", "Docker"],
    "recommendation": "strong",
    "evaluationSummary": "Overall strong candidate with solid technical foundation..."
}

SCORING GUIDELINES:
- Overall Score: 0-100 based on experience, skills, education, and relevance
- Recommendation: "strong" (75-100), "moderate" (50-74), "weak" (0-49)
- Be objective and fair in your assessment
`;

    return basePrompt;
}

// Alternative function for role-specific scoring
export async function evaluateCandidateForRole(
    candidateData: CleanResumeData,
    jobDescription: string
): Promise<CandidateEvaluation> {
    // This ensures job description is required for role-specific evaluation
    return evaluateCandidateWithLLM(candidateData, jobDescription);
}