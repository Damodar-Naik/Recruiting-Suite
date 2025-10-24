// FILE: app\api\parse-resume\route.ts

import { AffindaAPI, AffindaCredential } from "@affinda/affinda";
import { NextRequest, NextResponse } from "next/server";
import { saveCandidate } from "@/app/lib/db";
import { extractCleanData } from "@/app/lib/affinda";
import { evaluateCandidateWithLLM } from "@/app/lib/llm-scoring";
import { getJobDescriptionText } from '@/app/lib/job-descriptions';


export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const jobRole = formData.get("jobRole") as string; // 'frontend', 'backend', etc.

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const credential = new AffindaCredential(process.env.AFFINDA_API_KEY!);
        const client = new AffindaAPI(credential);

        const doc = await client.createDocument({
            file: buffer,
            workspace: process.env.AFFINDA_WORKSPACE_ID!,
            fileName: file.name,
        });

        const cleanData = extractCleanData(doc);

        // Get job description for scoring
        const jobDescription = jobRole ? getJobDescriptionText(jobRole) : undefined;

        // Get LLM evaluation with specific job role
        const evaluation = await evaluateCandidateWithLLM(cleanData, jobDescription);

        // Save to database
        const candidateId = saveCandidate({
            ...cleanData,
            evaluation,
            appliedRole: jobRole // Store which role they were evaluated for
        });

        return NextResponse.json({
            data: cleanData,
            evaluation,
            candidateId,
            evaluatedFor: jobRole,
            message: "Resume parsed, evaluated, and saved successfully"
        });
    } catch (error) {
        console.error("Error parsing resume:", error);
        return NextResponse.json(
            { error: "Failed to parse resume" },
            { status: 500 }
        );
    }
}