"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const itemService = __importStar(require("../services/itemService"));
const router = (0, express_1.Router)();
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
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const items = yield itemService.getItems(limit);
        res.json(items);
    }
    catch (error) {
        console.error('Error retrieving items:', error);
        next(error);
    }
}));
// GET /api/items/:id - Retrieve a single item by id
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield itemService.getItem(req.params.id);
        if (!item) {
            res.status(404).json({ error: 'Item not found' });
            return;
        }
        res.json(item);
    }
    catch (error) {
        console.error('Error retrieving item:', error);
        next(error);
    }
}));
// POST /api/items - Create a new item
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newItem = req.body;
        const createdItem = yield itemService.createItem(newItem);
        res.status(201).json(createdItem);
    }
    catch (error) {
        console.error('Error creating item:', error);
        next(error);
    }
}));
// PUT /api/items/:id - Update an existing item
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idAsNum = Number(req.params.id);
        const updatedItem = yield itemService.updateItem(idAsNum, req.body);
        res.json(updatedItem);
    }
    catch (error) {
        console.error('Error updating item:', error);
        next(error);
    }
}));
// DELETE /api/items/:id - Delete an item
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idAsNum = Number(req.params.id);
        yield itemService.deleteItem(idAsNum);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting item:', error);
        next(error);
    }
}));
exports.default = router;
