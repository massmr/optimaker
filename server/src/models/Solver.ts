import { z } from 'zod';

export const SolverInputSchema = z.object({
  students: z.array(z.object({
    id: z.string(),
    preferences: z.object({
      theme_prefered: z.string(),
      themes_liked: z.array(z.string()),
    })
  })),
  projects: z.array(z.object({
    id: z.string(),
    title: z.string(),
    primary_theme: z.string(),
    secondary_themes: z.array(z.string()),
    difficulty: z.number(),
    places: z.number(),
  })),
  affinities: z.array(z.object({
    studentId: z.string(),
    projectId: z.string(),
    affinity: z.number(),
  })),
  profile: z.string(),
});

export type SolverInput = z.infer<typeof SolverInputSchema>;