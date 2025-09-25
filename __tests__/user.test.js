import '@testing-library/jest-dom';
import { GET, PUT } from '@/app/api/user/[id]/route';
import connectDB from '@/db.mjs';
import {User} from '../Model/User.mjs';
import { getServerSession } from 'next-auth';
import { it } from '@jest/globals';

// import { jest } from '@jest/globals';

jest.mock('@/db.mjs', () => jest.fn());
jest.mock('next-auth/next', () => ({
    getServerSession: jest.fn()
}));
jest.mock('../Model/User.mjs', () => ({
    User: {
        findById: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
    }
}));




describe('GET /api/user/[id]', () => {
    let request, params, session, user;

    beforeEach(() => {
        request = {};
        params = { id: 'me' };
        session = { user: { id: '123' } };
        user = { name: 'Test User' };
    });

    it('returns 401 if no session', async () => {
        getServerSession.mockResolvedValue(null);
        const response = await GET(request, { params });
        expect(response.status).toBe(401);
    });

    it('returns 404 if user not found', async () => {
        getServerSession.mockResolvedValue(session);
        User.findById.mockReturnThis();
        User.select.mockResolvedValue(null);
        const response = await GET(request, { params });
        expect(response.status).toBe(404);
    });

    it('returns user data', async () => {
        getServerSession.mockResolvedValue(session);
        User.findById.mockReturnThis();
        User.select.mockResolvedValue(user);
        const response = await GET(request, { params });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual(user);
    });
    it('modifies the user data', async () => {
        getServerSession.mockResolvedValue(session);
        User.findById.mockResolvedValue(user);
        request.json = jest.fn().mockResolvedValue({ name: 'New Name' });
        user.save = jest.fn().mockResolvedValue(user);
        const response = await PUT(request, { params });
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.name).toBe('New Name');
    });
});
