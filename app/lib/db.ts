// FILE: app/lib/db.ts - UPDATE THIS FILE

import Database from 'better-sqlite3';
import path from 'path';
import { CleanResumeData } from '@/app/types/resume';
import { CandidateEvaluation } from './llm-scoring';

const db = new Database(path.join(process.cwd(), 'candidates.db'));

// Create table with essential fields including stage
db.exec(`
  CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    familyName TEXT,
    email TEXT,
    phone TEXT,
    summary TEXT,
    totalYearsExperience REAL,
    data TEXT,
    evaluation TEXT,
    overallScore REAL DEFAULT 0,
    recommendation TEXT,
    appliedRole TEXT,
    onboardingStage TEXT DEFAULT 'new',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface CandidateWithEvaluation {
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
  evaluation?: CandidateEvaluation;
  rawData: CleanResumeData;
  createdAt: string;
}

// Save candidate with evaluation data
export const saveCandidate = (data: CleanResumeData & {
  evaluation?: CandidateEvaluation;
  appliedRole?: string;
}): number => {
  const stmt = db.prepare(`
    INSERT INTO candidates (
      firstName, familyName, email, phone, summary,
      totalYearsExperience, data, evaluation, overallScore,
      recommendation, appliedRole, onboardingStage
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.candidateName.firstName,
    data.candidateName.familyName,
    data.email[0] || '',
    data.phoneNumber[0] || '',
    data.summary,
    data.totalYearsExperience,
    JSON.stringify(data),
    data.evaluation ? JSON.stringify(data.evaluation) : null,
    data.evaluation?.overallScore || 0,
    data.evaluation?.recommendation || '',
    data.appliedRole || '',
    'new' // Default stage for new candidates
  );

  return Number(result.lastInsertRowid);
};

// Get all candidates for HR dashboard
export const getAllCandidates = (): CandidateWithEvaluation[] => {
  const stmt = db.prepare('SELECT * FROM candidates ORDER BY createdAt DESC');
  const rows = stmt.all() as any[];

  return rows.map(row => ({
    id: row.id,
    firstName: row.firstName,
    familyName: row.familyName,
    email: row.email,
    phone: row.phone,
    summary: row.summary,
    totalYearsExperience: row.totalYearsExperience,
    appliedRole: row.appliedRole,
    overallScore: row.overallScore,
    recommendation: row.recommendation,
    onboardingStage: row.onboardingStage || 'new',
    evaluation: row.evaluation ? JSON.parse(row.evaluation) : undefined,
    rawData: JSON.parse(row.data),
    createdAt: row.createdAt
  }));
};

// Get candidates by role for HR filtering
export const getCandidatesByRole = (role: string): CandidateWithEvaluation[] => {
  const stmt = db.prepare(`
    SELECT * FROM candidates
    WHERE appliedRole = ?
    ORDER BY createdAt DESC
  `);
  const rows = stmt.all(role) as any[];

  return rows.map(row => ({
    id: row.id,
    firstName: row.firstName,
    familyName: row.familyName,
    email: row.email,
    phone: row.phone,
    summary: row.summary,
    totalYearsExperience: row.totalYearsExperience,
    appliedRole: row.appliedRole,
    overallScore: row.overallScore,
    recommendation: row.recommendation,
    onboardingStage: row.onboardingStage || 'new',
    evaluation: row.evaluation ? JSON.parse(row.evaluation) : undefined,
    rawData: JSON.parse(row.data),
    createdAt: row.createdAt
  }));
};

// Update candidate onboarding stage
export const updateCandidateStage = (id: number, onboardingStage: string): void => {
  const stmt = db.prepare('UPDATE candidates SET onboardingStage = ? WHERE id = ?');
  stmt.run(onboardingStage, id);
};

// Get top candidates by score
export const getTopCandidates = (limit: number = 10): CandidateWithEvaluation[] => {
  const stmt = db.prepare(`
    SELECT * FROM candidates
    WHERE overallScore > 0
    ORDER BY overallScore DESC
    LIMIT ?
  `);
  const rows = stmt.all(limit) as any[];

  return rows.map(row => ({
    id: row.id,
    firstName: row.firstName,
    familyName: row.familyName,
    email: row.email,
    phone: row.phone,
    summary: row.summary,
    totalYearsExperience: row.totalYearsExperience,
    appliedRole: row.appliedRole,
    overallScore: row.overallScore,
    recommendation: row.recommendation,
    onboardingStage: row.onboardingStage || 'new',
    evaluation: row.evaluation ? JSON.parse(row.evaluation) : undefined,
    rawData: JSON.parse(row.data),
    createdAt: row.createdAt
  }));
};