require('dotenv').config();
const request = require('supertest');
const mongoose = require("mongoose");
const app = require('../app');

jest.mock('../controllers/logs-controller');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STR);
});

afterAll(async () => {
    jest.restoreAllMocks();
    await mongoose.connection.close();
});

describe('/auth/login', () => {
    it('/auth/login => returns token when provided correct username and password', async () => {
        const response = await request(app).post('/auth/login').send({username: 'visitor', password: process.env.TEST_CORRECT_ENCRYPTED_PW});
        expect(response.status).toEqual(200);
        expect(response.body.token).toEqual(expect.any(String));
    });

    it('/auth/login => returns 401 unauthorized error when provided incorrect username', async () => {
        const response = await request(app).post('/auth/login').send({username: 'incorrect', password: process.env.TEST_CORRECT_ENCRYPTED_PW});
        expect(response.status).toEqual(401);
        expect(response.text).toEqual('Unauthorized. Incorrect username or password.');
    });

    it('/auth/login => returns 401 unauthorized error when provided incorrect password', async () => {
        const response = await request(app).post('/auth/login').send({username: 'visitor', password: process.env.TEST_INCORRECT_ENCRYPTED_PW});
        expect(response.status).toEqual(401);
        expect(response.text).toEqual('Unauthorized. Incorrect username or password.');
    });
});

describe('/auth/fetch-key', () => {
    it('/auth/fetch-key => returns public key', async () => {
        const response = await request(app).get('/auth/fetch-key');
        expect(response.status).toEqual(200);
        expect(response.body.key).toEqual(process.env.PUBLIC_KEY);
    });
});