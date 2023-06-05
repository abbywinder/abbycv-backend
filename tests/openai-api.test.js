const request = require('supertest');
const app = require('../app');
const { OpenAIApi } = require('openai');

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    createWriteStream: {
        write: jest.fn(),
        end: jest.fn()
    },
}));

beforeAll(async () => {
    jest.spyOn(OpenAIApi.prototype, 'createChatCompletion').mockReturnValue({
        data: {
            choices: [{
                message: {
                    content: 'This is a test'
                }
            }]
        }
    });
});

afterAll(async () => {
    jest.restoreAllMocks();
});

describe('CHAT-GPT', () => {
    it('api/chat => returns data when prompted', async () => {
        const response = await request(app).post('/api/chat').send({chat: [{sender: 'client', message: 'say this is a test'}]});
        expect(response.status).toEqual(200);
        expect(response.body.response).toEqual('This is a test');
    });

    it('api/chat => req.body.chat must be array and req.body.chat.message must be string', async () => {
        const responsePass = await request(app).post('/api/chat').send({chat: [{sender: 'client', message: 'say this is a test'}]});
        expect(responsePass.status).toEqual(200);
        expect(responsePass.body.response).toEqual('This is a test');
    });

    it('api/chat => sends 400 status code if req.body.chat is not array', async () => {
        const response = await request(app).post('/api/chat').send({chat: {sender: 'client', message: 'say this is a test'}});
        expect(response.status).toEqual(400);
        expect(response.text).toEqual('Bad request.');
    });

    it('api/chat => sends 400 status code if req.body.chat.message is not string', async () => {
        const response = await request(app).post('/api/chat').send({chat: [{sender: 'client', message: 123}]});
        expect(response.status).toEqual(400);
        expect(response.text).toEqual('Bad request.');
    });

    it('api/chat => has a limit of 5 requests per IP address', async () => {
        for (i = 0; i < 5; i++) {
            await request(app).post('/api/chat').send({chat: [{sender: 'client', message: 'say this is a test'}]});
        };
        const response = await request(app).post('/api/chat').send({chat: [{sender: 'client', message: 'say this is a test'}]});
        expect(response.status).toEqual(429);
        expect(response.text).toEqual('You have reached your request limit for today');
    });
});