import '@testing-library/jest-dom';
import {POST, GET} from '@/app/api/recipe/route';
import connectDB from '@/db.mjs';
import { Recipe, validateRecipe } from '../Model/Recipe.mjs';
import { User } from '../Model/User.mjs';
import { getServerSession } from 'next-auth';
import { it } from '@jest/globals';

jest.mock('@/db.mjs', () => jest.fn());
jest.mock('next-auth/next', () => ({
    getServerSession: jest.fn()
}));
jest.mock('../Model/Recipe.mjs', () => {
    const Recipe = jest.fn();
    return ({ Recipe, validateRecipe: jest.fn() });
   
});
jest.mock('../Model/User.mjs', () => ({
    User: {
        findById: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
    }
}));

describe('POST /api/recipe', () => {
    let request, session, user, recipe;

    beforeEach(() => {
        request = { json: jest.fn() };
        session = { user: { id: '123' } };
        user = { name: 'Test User', recipes: [] };
        recipe = { title: 'Test Recipe' };
    }
);
    it('returns 401 if no session', async () => {
        getServerSession.mockResolvedValue(null);
        const response = await POST(request);
        expect(response.status).toBe(401);
    });

    it('returns 400 if invalid data', async () => {
        getServerSession.mockResolvedValue(session);
        request.json.mockResolvedValue({ title: '' });
        validateRecipe.mockImplementation(() => ({ error: { details: [{ message: 'Invalid title' }] } }));
        const response = await POST(request);
        expect(response.status).toBe(400);
    });

    it('saves the recipe', async () => {
        getServerSession.mockResolvedValue(session);
        request.json.mockResolvedValue(recipe);
        validateRecipe.mockReturnValue({});
        Recipe.mockImplementation(() => recipe);
        recipe.save = jest.fn().mockResolvedValue(recipe);
        User.findById.mockResolvedValue(user);
        user.save = jest.fn().mockResolvedValue(user);
        const response = await POST(request);
        expect(response.status).toBe(201);
        const data = await response.json();
        expect(recipe).toMatchObject(data);
    });
}
);