// FILE: app/api/candidates/route.ts - REPLACE ENTIRE FILE

import { NextResponse } from "next/server";
import { getAllCandidates, getCandidatesByRole, updateCandidateStage } from "@/app/lib/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');

        let candidates;
        if (role && role !== 'all') {
            candidates = getCandidatesByRole(role);
        } else {
            candidates = getAllCandidates();
        }

        return NextResponse.json({ candidates });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        return NextResponse.json(
            { error: "Failed to fetch candidates" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, onboardingStage } = body;

        if (!id || !onboardingStage) {
            return NextResponse.json(
                { error: "Missing id or onboardingStage" },
                { status: 400 }
            );
        }

        updateCandidateStage(id, onboardingStage);

        return NextResponse.json({
            success: true,
            message: "Candidate onboarding stage updated"
        });
    } catch (error) {
        console.error("Error updating candidate:", error);
        return NextResponse.json(
            { error: "Failed to update candidate" },
            { status: 500 }
        );
    }
}