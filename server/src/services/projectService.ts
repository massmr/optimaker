import Project from '../models/Project';

export async function pushProject({title, description, primary_theme, secondary_themes, places, difficulty, ownerId } : { 
        title: string, 
        description: string, 
        primary_theme: string,
        secondary_themes?: string[],
        places: number,
        difficulty: number,
        ownerId: string }) {
  return Project.create({ title, description, primary_theme, secondary_themes, places, difficulty, ownerId });
}