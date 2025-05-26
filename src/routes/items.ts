import { Router, Request, Response, NextFunction } from 'express';
import * as itemService from '../services/itemService';

const router = Router();

// GET /api/items - Retrieve all items
// router.get('/', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const items = await itemService.getItems();
//         res.json(items);
//     } catch (error) {
//         console.error('Error retrieving items:', error);
//         next(error);
//     }
// });
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const items = await itemService.getItems(limit);
    res.json(items);
  } catch (error) {
    console.error('Error retrieving items:', error);
    next(error);
  }
});


// GET /api/items/:id - Retrieve a single item by id
router.get('/:id', async (req: Request<{ id: number }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const item = await itemService.getItem(req.params.id);
        if (!item) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        res.json(item);
    } catch (error) {
        console.error('Error retrieving item:', error);
        next(error);
    }
});

// POST /api/items - Create a new item
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newItem = req.body;
        const createdItem = await itemService.createItem(newItem);
        res.status(201).json(createdItem);
    } catch (error) {
        console.error('Error creating item:', error);
        next(error);
    }
});

// PUT /api/items/:id - Update an existing item
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idAsNum = Number(req.params.id)
        const updatedItem = await itemService.updateItem(idAsNum, req.body);
        res.json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error);
        next(error);
    }
});

// DELETE /api/items/:id - Delete an item
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idAsNum = Number(req.params.id)
        await itemService.deleteItem(idAsNum);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting item:', error);
        next(error);
    }
});

export default router;
