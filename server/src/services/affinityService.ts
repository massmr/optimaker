// services/affinityService.ts
import Affinity from "../models/Affinity";
import Project from "../models/Project";
import mongoose from "mongoose";

/* ========== Shared Validators ========== */

function validateAffinityRange(affinity: number) {
  if (affinity < 0 || affinity > 4) {
    throw { status: 400, message: "L'affinité doit être comprise entre 0 et 4." };
  }
}

async function ensureProjectExists(projectId: string) {
  const exists = await Project.exists({ _id: new mongoose.Types.ObjectId(projectId) });
  if (!exists) throw { status: 404, message: "Projet introuvable." };
}

/* ========== Work functions ========== */
async function getExistingAffinityOrFail(affinityId: string) {
  const affinity = await Affinity.findOne({ _id: new mongoose.Types.ObjectId(affinityId) });
  if (!affinity) {
    throw { status: 404, message: "Affinité introuvable pour ce projet." };
  }
  return affinity;
}

async function ensureAffinityDoesNotExist(studentId: string, projectId: string) {
  const existing = await Affinity.findOne({ studentId, projectId });
  if (existing) {
    throw { status: 409, message: "Affinité déjà définie pour ce projet." };
  }
}

/* ========== Create ========== */
export async function handleAffinityCreation(
  studentId: string,
  projectId: string,
  affinity: number
) {
  validateAffinityRange(affinity);
  await ensureProjectExists(projectId);
  await ensureAffinityDoesNotExist(studentId, projectId)

  return await Affinity.create({ studentId, projectId, affinity });
}

/* ========== Update ========== */
export async function handleAffinityUpdate(
  affinityId: string,
  affinity: number
) {
  validateAffinityRange(affinity);
  const existing = await getExistingAffinityOrFail(affinityId);

  existing.affinity = affinity;
  return await existing.save();
}