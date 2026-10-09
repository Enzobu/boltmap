import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().email().max(191),
  password: z.string().min(8).max(128),
});

export const projectSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

export const entrySchema = z.object({
  name: z.string().trim().min(1).max(180),
  quantity: z.coerce.number().int().min(1).max(9999),
  notes: z.string().trim().max(4000).optional().default(""),
});

export const entryPatchSchema = entrySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field is required.",
);
