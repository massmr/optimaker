import { spawn } from 'child_process';
import crypto from "crypto";
import User from "../models/User";
import Project from "../models/Project";
import Affinity from "../models/Affinity";
import { SolverInputSchema, SolverInput } from "../models/Solver";
import SolverSnapshot from "../models/SolverSnapshot";

/* Work logic */
export async function generateSolverInput() {
  const students = await User.find({ role: "student" });
  const projects = await Project.find();
  const affinities = await Affinity.find();

  return {
    students: students.map(student => ({
      id: student._id.toString(),
      preferences: student.preferences,
    })),
    projects: projects.map(project => ({
      id: project._id.toString(),
      title: project.title,
      primary_theme: project.primary_theme,
      secondary_themes: project.secondary_themes,
      difficulty: project.difficulty,
      places: project.places,
    })),
    affinities: affinities.map(affinity => ({
      studentId: affinity.studentId.toString(),
      projectId: affinity.projectId.toString(),
      affinity: affinity.affinity,
    })),
    profile: "balanced",
  };
}

function callPythonSolver(input: SolverInput): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonCmd = process.env.PYTHON_CMD || 'python3';
    const proc = spawn(pythonCmd, ['solver/solver.py']);
    let stdout = '';
    let stderr = '';

    proc.stdin.write(JSON.stringify(input));
    proc.stdin.end();

    proc.stdout.on('data', d => stdout += d);
    proc.stderr.on('data', d => stderr += d);

    proc.on('close', code => {
      if (code !== 0) {
        return reject(new Error(`Solver exited with code ${code}: ${stderr}`));
      }
      resolve(stdout);
    });
  });
}

async function prepareSolverInput(): Promise<SolverInput> {
  const raw = await generateSolverInput();
  const parsed = SolverInputSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid solver input: ${parsed.error.message}`);
  }
  return parsed.data;
}

function parseSolverOutput(raw: string): any {
  // Prints all solver response
  //console.error("=== [DEBUG] Raw solver output ===");
  //console.error(raw);
  //console.error("=== [END DEBUG] ===");
  try {
    const lastLine = raw.trim().split('\n').pop();
    if (!lastLine) throw new Error("Sortie vide");
    return JSON.parse(lastLine);
  } catch (err) {
    throw new Error(`Solver output parsing failed: ${(err as Error).message}`);
  }
}

async function saveSnapshot(input: SolverInput, result: any, inputHash: string): Promise<void> {
  await SolverSnapshot.create({
    profile: input.profile,
    result: result,
    studentCount: input.students.length,
    projectCount: input.projects.length,
    inputHash
  });
}

function computeInputHash(input: SolverInput): string {
  return crypto.createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex");
}

/* Handlers */
export async function handleSolverOperations() {
  const input = await prepareSolverInput();
  const inputHash = computeInputHash(input);
  const rawOutput = await callPythonSolver(input);
  const result = parseSolverOutput(rawOutput);
  await saveSnapshot(input, result, inputHash);
  return result;
}