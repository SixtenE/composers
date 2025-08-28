import z from 'zod'

export const composerSchema = z
    .object({
        name: z.string().min(2).max(100),
        born: z.number().min(0).max(new Date().getFullYear()),
        death: z.number().min(0).max(new Date().getFullYear()).optional(),
        era: z.string().min(2).max(100),
        bio: z.string().min(10).max(1000),
        notableWorks: z.array(z.string().min(2).max(100)),
    })
    .refine((data) => data.death !== undefined && data.death >= data.born, {
        message: 'Born year cant be after death year',
        path: ['death', 'born'],
    })
