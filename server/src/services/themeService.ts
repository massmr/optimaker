import Theme from "../models/Theme";

export async function handleThemeCreation(name: string) {
    validateThemeInput(name);
    await ensureThemeDoesNotExist(name);
    return await pushTheme(name);
}

export async function handleThemeDeletion(name: string) {
    validateThemeInput(name);
    ensureThemeExists(name);
    return await deleteTheme(name);
}

function validateThemeInput(name: string) {
  if (!name) throw { status: 400, message: "Le nom est requis." };
}

async function ensureThemeExists(name: string) {
    const existing = await Theme.findOne({ name });
    if (!existing) {
        throw { status: 404, message: "Thématique non existante"};
    }
}

async function ensureThemeDoesNotExist(name: string) {
  const existing = await Theme.findOne({ name });
  if (existing) {
    throw { status: 409, message: "Thématique déjà existante." };
  }
}

async function pushTheme(name: string) {
    return Theme.create({ name: name.trim() });
}

async function deleteTheme(name: string) {
    return Theme.deleteOne({ name: name.trim() });
}