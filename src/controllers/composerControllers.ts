import { Request, Response } from 'express'
import ComposerModel from '../models/composerModel'
import { composerSchema } from '../schemas/composerSchema'
import z from 'zod'

type dbError = {
    error: string
    errorLabelSet: Record<string, unknown>
    errorResponse: {
        index: number
        code: number
        errmsg: string
        keyPattern: Record<string, number>
        keyValue: Record<string, string>
    }
}

async function getComposers(req: Request, res: Response) {
    const validatedQuery = z
        .object({
            offset: z.string().min(0).optional().default('0'),
            limit: z.string().min(0).optional().default('10'),
            name: z.string().min(0).max(100).optional(),
            born: z.string().min(0).optional(),
            death: z.string().min(0).optional(),
            era: z.string().min(0).max(100).optional(),
            sortBy: z
                .enum(['born', '-born', 'name', '-name', 'death', '-death'])
                .default('name'),
        })
        .safeParse(req.query)

    if (!validatedQuery.success) {
        return res.status(400).json({ error: 'Invalid query parameters' })
    }

    try {
        const composers = await ComposerModel.find({
            name: {
                $regex:
                    validatedQuery.data.name !== undefined
                        ? validatedQuery.data.name
                        : '',
                $options: 'i',
            },
        }).sort({
            [validatedQuery.data.sortBy.replace('-', '')]:
                validatedQuery.data.sortBy.startsWith('-') ? -1 : 1,
        })
        return res
            .status(200)
            .json(
                composers.slice(
                    parseInt(validatedQuery.data.offset) || 0,
                    validatedQuery.data.limit
                        ? parseInt(validatedQuery.data.limit) +
                              (parseInt(validatedQuery.data.offset) || 0)
                        : undefined,
                ),
            )
    } catch (error) {
        const dbError = error as dbError
        switch (dbError.errorResponse.code) {
            default:
                return res.status(500).json({
                    details: dbError.errorResponse.errmsg,
                })
        }
    }
}

async function getComposerById(req: Request, res: Response) {
    const validatedParams = z
        .object({
            id: z.string(),
        })
        .safeParse(req.params)

    if (!validatedParams.success) {
        return res.status(400).json({ error: 'Invalid ID parameter' })
    }

    try {
        const composer = await ComposerModel.findById(validatedParams.data.id)
        if (!composer) {
            return res.status(404).json({
                error: 'Composer not found',
                message: 'No composer found with the given ID',
            })
        }
        return res.status(200).json(composer)
    } catch (error) {
        const dbError = error as dbError
        switch (dbError.errorResponse.code) {
            default:
                return res.status(500).json({
                    details: dbError.errorResponse.code,
                })
        }
    }
}

async function createComposer(req: Request, res: Response) {
    const validatedBody = composerSchema.safeParse(req.body)

    if (!validatedBody.success) {
        return res.status(400).json({ error: 'Invalid request body' })
    }

    try {
        const newComposer = new ComposerModel(validatedBody.data)
        await newComposer.save()
        return res.status(201).json(newComposer)
    } catch (error: unknown) {
        const dbError = error as dbError

        switch (dbError.errorResponse.code) {
            case 11000:
                return res.status(409).json({
                    error: 'Composer already exists',
                    details: dbError.errorResponse,
                })
            default:
                return res.status(500).json({
                    details: dbError.errorResponse.code,
                })
        }
    }
}

async function updateComposerById(req: Request, res: Response) {
    const validatedParams = z
        .object({
            id: z.string(),
        })
        .safeParse(req.params)

    if (!validatedParams.success) {
        return res.status(400).json({ error: 'Invalid ID parameter' })
    }

    const validatedBody = composerSchema.safeParse(req.body)

    if (!validatedBody.success) {
        return res.status(400).json({
            error: 'Invalid request body',
            message: validatedBody.error,
        })
    }

    try {
        const composer = await ComposerModel.findByIdAndUpdate(
            validatedParams.data.id,
            validatedBody.data,
            { runValidators: true, new: true },
        )
        if (!composer) {
            return res.status(404).json({ error: 'Composer not found' })
        }
        return res.status(200).json(composer)
    } catch (error) {
        const dbError = error as dbError
        switch (dbError.errorResponse.code) {
            default:
                return res.status(500).json({
                    details: dbError.errorResponse.code,
                })
        }
    }
}

async function deleteComposerById(req: Request, res: Response) {
    const validatedParams = z
        .object({
            id: z.string(),
        })
        .safeParse(req.params)

    if (!validatedParams.success) {
        return res.status(400).json({ error: 'Invalid ID parameter' })
    }

    try {
        const composer = await ComposerModel.findByIdAndDelete(
            validatedParams.data.id,
        )
        if (!composer) {
            return res.status(404).json({ error: 'Composer not found' })
        }
        return res.status(204).send()
    } catch (error) {
        const dbError = error as dbError
        switch (dbError.errorResponse.code) {
            default:
                return res.status(500).json({
                    details: dbError.errorResponse.code,
                })
        }
    }
}

async function addNotableWork(req: Request, res: Response) {
    const validatedParams = z
        .object({
            id: z.string(),
        })
        .safeParse(req.params)

    if (!validatedParams.success) {
        return res.status(400).json({ error: 'Invalid ID parameter' })
    }

    const validatedBody = z
        .array(z.string().min(1).max(100))
        .safeParse(req.body)

    if (!validatedBody.success) {
        return res.status(400).json({ error: 'Invalid request body' })
    }

    try {
        const composer = await ComposerModel.findById(validatedParams.data.id)

        if (!composer) {
            return res.status(404).json({ error: 'Composer not found' })
        }

        composer.notableWorks.push(...validatedBody.data)
        await composer.save()
        return res.status(200).json(composer)
    } catch (error) {
        const dbError = error as dbError
        switch (dbError.errorResponse.code) {
            default:
                return res.status(500).json({
                    details: dbError,
                })
        }
    }
}

export {
    addNotableWork,
    getComposers,
    createComposer,
    getComposerById,
    updateComposerById,
    deleteComposerById,
}
