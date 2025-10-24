import { AffindaAPI, AffindaCredential } from "@affinda/affinda";
import { CleanResumeData } from "@/app/types/resume";

export const affindaClient = new AffindaAPI(
    new AffindaCredential(process.env.AFFINDA_API_KEY!)
);

export const extractCleanData = (affindaResponse: any): CleanResumeData => {
    const data = affindaResponse.data;

    return {
        candidateName: {
            firstName: data.candidateName?.parsed?.firstName?.parsed || "",
            familyName: data.candidateName?.parsed?.familyName?.parsed || "",
        },
        email: data.email?.map((e: any) => e.parsed) || [],
        phoneNumber: data.phoneNumber?.map((p: any) => p.raw) || [],
        website: data.website?.map((w: any) => w.parsed?.url).filter(Boolean) || [],
        summary: data.summary?.parsed || "",
        totalYearsExperience: data.totalYearsExperience?.parsed || 0,
        workExperience: data.workExperience?.map((exp: any) => ({
            jobTitle: exp.parsed?.workExperienceJobTitle?.parsed || "",
            organization: exp.parsed?.workExperienceOrganization?.parsed || "",
            location: exp.parsed?.workExperienceLocation?.parsed?.formatted || "",
            dates: {
                start: exp.parsed?.workExperienceDates?.parsed?.start?.date || "",
                end: exp.parsed?.workExperienceDates?.parsed?.end?.date || "",
                isCurrent: exp.parsed?.workExperienceDates?.parsed?.end?.isCurrent || false,
                durationInMonths: exp.parsed?.workExperienceDates?.parsed?.durationInMonths || 0,
            },
            description: exp.parsed?.workExperienceDescription?.parsed || "",
            type: exp.parsed?.workExperienceType?.parsed?.value || "",
        })) || [],
        education: data.education?.map((edu: any) => ({
            accreditation: edu.parsed?.educationAccreditation?.parsed || "",
            level: edu.parsed?.educationLevel?.parsed?.value || "",
            dates: {
                endDate: edu.parsed?.educationDates?.parsed?.end?.date || "",
                year: edu.parsed?.educationDates?.parsed?.end?.year || 0,
            },
            grade: {
                score: edu.parsed?.educationGrade?.parsed?.educationGradeScore?.parsed || 0,
                unit: edu.parsed?.educationGrade?.parsed?.gradeUnit?.parsed?.value || "",
            },
        })) || [],
        project: data.project?.map((proj: any) => ({
            title: proj.parsed?.projectTitle?.parsed || "",
            description: proj.parsed?.projectDescription?.parsed || "",
            type: proj.parsed?.projectType?.parsed?.value || "",
        })) || [],
        skill: data.skill?.map((skill: any) => ({
            name: skill.parsed?.name || "",
            type: skill.parsed?.type || "",
            category: skill.parsed?.category || "",
            subCategory: skill.parsed?.subCategory || "",
        })) || [],
    };
};