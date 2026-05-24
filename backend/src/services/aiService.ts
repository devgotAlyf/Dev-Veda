import { GoogleGenAI } from '@google/genai';
import { AIServiceError } from '../middleware/errorHandler';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export interface AssessmentInput {
  subject: string;
  gradeLevel: string;
  numberOfQuestions: number;
  totalMarks: number;
  questionTypes: string[];
  difficulty: string;
  additionalInstructions: string;
  fileContent: string;
}

interface GeneratedQuestion {
  questionNumber: number;
  questionText: string;
  type: string;
  difficulty: string;
  marks: number;
  options: string[];
}

interface GeneratedSection {
  sectionLabel: string;
  sectionTitle: string;
  instruction: string;
  totalMarks: number;
  questions: GeneratedQuestion[];
}

export interface GeneratedAssessment {
  title: string;
  subject: string;
  gradeLevel: string;
  totalMarks: number;
  duration: string;
  instructions: string[];
  sections: GeneratedSection[];
}

export async function generateAssessment(data: AssessmentInput): Promise<GeneratedAssessment> {
  const {
    subject,
    gradeLevel,
    numberOfQuestions,
    totalMarks,
    questionTypes,
    difficulty,
    additionalInstructions,
    fileContent,
  } = data;

  const prompt = `You are an expert academic question paper creator.
Create a structured question paper for the following:

Subject: ${subject}
Grade: ${gradeLevel}
Total Questions: ${numberOfQuestions}
Total Marks: ${totalMarks}
Question Types: ${questionTypes.join(', ')}
Difficulty: ${difficulty}
Additional Instructions: ${additionalInstructions}
${fileContent ? 'Reference Material:\n' + fileContent : ''}

Rules:
- Distribute questions into logical sections (A, B, C...)
- Section A = easiest type, last section = hardest
- Each question must have a difficulty tag
- Marks must add up to exactly ${totalMarks}
- MCQ must have 4 options labeled A. B. C. D.
- Estimated duration = totalMarks × 1.5 minutes, formatted as 'X Hours Y Minutes'
- Write natural, examiner-quality question text
- Vary cognitive levels (recall, apply, analyze)

Respond ONLY with valid JSON. No markdown. No explanation.
JSON structure:
{
  "title": "string",
  "subject": "string",
  "gradeLevel": "string",
  "totalMarks": number,
  "duration": "string",
  "instructions": ["string"],
  "sections": [
    {
      "sectionLabel": "Section A",
      "sectionTitle": "string",
      "instruction": "string",
      "totalMarks": number,
      "questions": [
        {
          "questionNumber": number,
          "questionText": "string",
          "type": "mcq|short|long|true_false",
          "difficulty": "easy|medium|hard",
          "marks": number,
          "options": []
        }
      ]
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let rawText = response.text || '';

    rawText = rawText.replace(/```json?\n?/g, '').replace(/```/g, '').trim();

    let parsed: GeneratedAssessment;

    try {
      parsed = JSON.parse(rawText) as GeneratedAssessment;
    } catch (parseError) {
      const parseErr = parseError as Error;
      throw new AIServiceError(`Failed to parse AI response as JSON: ${parseErr.message}`);
    }

    if (!parsed.sections || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
      throw new AIServiceError('AI response missing sections array or sections is empty');
    }

    for (const section of parsed.sections) {
      if (!section.questions || !Array.isArray(section.questions) || section.questions.length === 0) {
        throw new AIServiceError(
          `Section "${section.sectionLabel}" has no questions`
        );
      }
    }

    const actualTotalMarks = parsed.sections.reduce((sectionSum, section) => {
      return (
        sectionSum +
        section.questions.reduce((qSum, q) => qSum + q.marks, 0)
      );
    }, 0);

    const marksDifference = Math.abs(actualTotalMarks - totalMarks);
    if (marksDifference !== 0) {
      throw new AIServiceError(
        `Marks mismatch: expected ${totalMarks}, got ${actualTotalMarks} (difference: ${marksDifference})`
      );
    }

    return parsed;
  } catch (error) {
    if (error instanceof AIServiceError) {
      throw error;
    }
    const err = error as Error;
    throw new AIServiceError(`AI generation failed: ${err.message}`);
  }
}
