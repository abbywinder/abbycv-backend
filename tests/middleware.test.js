const request = require('supertest');
require('dotenv').config();
const { OpenAIApi } = require('openai');
const fs = require('fs');
const mongoose = require("mongoose");
const app = require('../app');
const { sanitizeReq } = require('../middleware/sanitize');
const { querySplitter } = require('../middleware/query-splitter');
const { ensureAuthenticatedAndAuthorised, addRoleVisitor, addRoleAdminOnly } = require('../middleware/auth');


jest.mock('../middleware/auth');

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    createWriteStream: jest.fn(() => {
        return {
          write: jest.fn(),
          end: jest.fn(),
        };
    })
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

    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STR);
});

afterEach(() => {
    jest.clearAllMocks();
});

afterAll(async () => {
    jest.restoreAllMocks();
    await mongoose.connection.close();
});


describe('Logger', () => {
    jest.mock('express-rate-limit', () => {
        return jest.fn().mockImplementation(() => {
          return (req, res, next) => {
            // Do nothing, bypasses 
            next();
          };
        });
    });

    ensureAuthenticatedAndAuthorised.mockImplementation((req, res, next) => {
        return next();
    });
    addRoleVisitor.mockImplementation((req, res, next) => {
        return next();
    });
    addRoleAdminOnly.mockImplementation((req, res, next) => {
        return next();
    });

    it('logs chats', async () => {
        await request(app).post('/api/chat').send({chat: [{sender: 'client', message: 'say this is a test'}]});
        expect(fs.createWriteStream).toHaveBeenCalledWith("logs/chats.txt",{"flags": "a"});
    });

    it('logs errors', async () => {
        await request(app).get('/api/lifestages/1');
        expect(fs.createWriteStream).toHaveBeenLastCalledWith("logs/errors.txt",{"flags": "a"});
    });

    it('logs access', async () => {
        await request(app).get('/api/lifestages');
        expect(fs.createWriteStream).toHaveBeenNthCalledWith(1,"logs/access.txt",{"flags": "a"});
    });

    it('logs sanitised inputs', async () => {
        await request(app).get('/api/lifestages');
        expect(fs.createWriteStream).toHaveBeenCalledWith("logs/sanitised.txt",{"flags": "a"});
    });
});

describe('Sanitize', () => {
    ensureAuthenticatedAndAuthorised.mockImplementation((req, res, next) => {
        return next();
    });
    addRoleVisitor.mockImplementation((req, res, next) => {
        return next();
    });
    addRoleAdminOnly.mockImplementation((req, res, next) => {
        return next();
    });

    jest.mock('express-rate-limit', () => {
        return jest.fn().mockImplementation(() => {
          return (req, res, next) => {
            // Do nothing, bypasses 
            next();
          };
        });
    });

    it('Sanitises inputs', async () => {
        let req = {
            query: {search: '<TEST>'},
            params: {id: '<TEST>'},
            headers: {header: '<TEST>'},
            cookies: {cookie1: '<TEST>'},
            body: {message: [{inner: '<TEST>'}]}
        };
        sanitizeReq(req, null, () => null);

        expect(req.query).toEqual({search: '&lt;TEST&gt;'})
        expect(req.params).toEqual({id: '&lt;TEST&gt;'})
        expect(req.headers).toEqual({header: '&lt;TEST&gt;'})
        expect(req.cookies).toEqual({cookie1: '&lt;TEST&gt;'})
        expect(req.body).toEqual({message: [{inner: '&lt;TEST&gt;'}]})
    });
});

describe('Query splitter', () => {
    ensureAuthenticatedAndAuthorised.mockImplementation((req, res, next) => {
        return next();
    });
    addRoleVisitor.mockImplementation((req, res, next) => {
        return next();
    });
    addRoleAdminOnly.mockImplementation((req, res, next) => {
        return next();
    });

    jest.mock('express-rate-limit', () => {
        return jest.fn().mockImplementation(() => {
          return (req, res, next) => {
            // Do nothing, bypasses 
            next();
          };
        });
    });

    let req = {
        query: {key1: 'test1,test2,test3'}
    };
    querySplitter(req, null, () => null);
    expect(req.query).toEqual({key1: ['test1','test2','test3']});
});

describe('Rate limiter', () => {
    ensureAuthenticatedAndAuthorised.mockImplementation((req, res, next) => {
        return next();
    });
    addRoleVisitor.mockImplementation((req, res, next) => {
        return next();
    });
    addRoleAdminOnly.mockImplementation((req, res, next) => {
        return next();
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