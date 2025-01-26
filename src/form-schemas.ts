import * as z from "zod";

export const SettingsSchema = z.object({
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    newPassword: z.string().min(8).optional(),
    isTwoFactorEnabled: z.boolean().optional(),
});
