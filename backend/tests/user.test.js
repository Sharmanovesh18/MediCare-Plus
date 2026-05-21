const request = require('supertest');
const app = require('../server');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Mock the database module
jest.mock('../config/db', () => ({
    execute: jest.fn()
}));

describe('User Integration Tests (Hospital Sys)', () => {
    
    beforeEach(() => {
        // Clear mocks before each test
        jest.clearAllMocks();
    });

    const testUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
    };

    describe('POST /api/user/register', () => {
        it('should register a new user successfully', async () => {
            // Mock DB response for INSERT (result is usually [resultSetHeader, undefined])
            db.execute.mockResolvedValue([{ insertId: 101 }]);

            const res = await request(app)
                .post('/api/user/register')
                .send(testUser);
            
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty('token');
            expect(db.execute).toHaveBeenCalledWith(
                expect.stringMatching(/INSERT INTO users/i),
                expect.arrayContaining([testUser.name, testUser.email])
            );
        });

        it('should fail registration if fields are missing', async () => {
            const res = await request(app)
                .post('/api/user/register')
                .send({ email: 'test@test.com' }); // Missing name and password
            
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Missing details');
        });
    });

    describe('POST /api/user/login', () => {
        it('should login successfully with correct credentials', async () => {
            // 1. Mock DB to return a user with a hashed password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(testUser.password, salt);
            
            db.execute.mockResolvedValue([
                [{ id: 101, email: testUser.email, password: hashedPassword }]
            ]);

            const res = await request(app)
                .post('/api/user/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });
            
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty('token');
        });

        it('should fail login with incorrect password', async () => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('correct_password', salt);
            
            db.execute.mockResolvedValue([
                [{ id: 101, email: testUser.email, password: hashedPassword }]
            ]);

            const res = await request(app)
                .post('/api/user/login')
                .send({
                    email: testUser.email,
                    password: 'wrong_password'
                });
            
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid credentials');
        });

        it('should fail login if user does not exist', async () => {
            // Mock DB to return empty array
            db.execute.mockResolvedValue([[]]);

            const res = await request(app)
                .post('/api/user/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });
            
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('User not found');
        });
    });
});
