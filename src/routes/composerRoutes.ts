import express, { Request, Response, Router } from 'express'
import ComposerModel from '../models/composerModel'
import {
    addNotableWork,
    createComposer,
    deleteComposerById,
    getComposerById,
    getComposers,
    updateComposerById,
} from '../controllers/composerControllers'

const router: Router = express.Router()

router.get('/', getComposers)
router.get('/:id', getComposerById)

router.post('/', createComposer)

router.put('/:id', updateComposerById)
router.put('/:id/notableworks', addNotableWork)

router.delete('/:id', deleteComposerById)

export default router
