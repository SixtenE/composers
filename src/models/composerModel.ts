import mongoose from 'mongoose'
import { composerSchema } from '../schemas/composerSchema'

const ComposerModel = mongoose.model(
    'Composer',
    new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
                validate: {
                    validator: (value: string) =>
                        composerSchema.shape.name.safeParse(value).success,
                },
            },
            born: {
                type: Number,
                required: true,
                validate: {
                    validator: (value: number) =>
                        composerSchema.shape.born.safeParse(value).success,
                },
            },
            death: {
                type: Number,
                validate: {
                    validator: (value: number) =>
                        composerSchema.shape.death.safeParse(value).success,
                },
            },
            era: {
                type: String,
                required: true,
                validate: {
                    validator: (value: string) =>
                        composerSchema.shape.era.safeParse(value).success,
                },
            },
            bio: {
                type: String,
                required: true,
                validate: {
                    validator: (value: string) =>
                        composerSchema.shape.bio.safeParse(value).success,
                },
            },
            notableWorks: { type: [String], required: true },
        },
        { timestamps: true },
    ).index({ name: 1 }, { unique: true }),
)

export default ComposerModel
