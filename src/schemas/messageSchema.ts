import {z} from 'zod';

export const MessageSchema = z.object({
    content: z
    .string()
    .min(5, 'Content must be atleast 10 Characters')
    .max(300, "Content must br no longer than 300 Characters")
})