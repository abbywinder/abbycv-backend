require('dotenv').config();
const mongoose = require("mongoose");
const request = require('supertest');
const app = require('../app');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STR);
});

afterAll(async () => {
    await request(app).delete('/api/lifestages/?title=test');
    await request(app).delete('/api/lifestages/?title=test-update');
    await mongoose.connection.close();
});

describe('GET', () => {
    it('/api/lifestages/ returns correct data', async () => {
        const response = await request(app).get('/api/lifestages').set('Accept', 'application/json');
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual((
            expect.arrayContaining([
                expect.objectContaining({
                    date_start: expect.any(String),
                    date_end: expect.any(String),
                    title: expect.any(String),
                    soft_skills: expect.arrayContaining([
                        expect.any(String)
                    ]),
                    hard_skills: expect.arrayContaining([
                        expect.any(String)
                    ])
                })
            ])
        ));
    });

    it('/api/lifestages/?title=1999-2006%20%E2%80%93%20Primary%20School/ call with query returns correct data', async () => {
        const response = await request(app).get('/api/lifestages/?title=1999-2006%20%E2%80%93%20Primary%20School').set('Accept', 'application/json');
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    date_start: "1999-01-01T10:53:53.000Z",
                    date_end: "2006-01-01T10:53:53.000Z",
                    title: "1999-2006 – Primary School",
                    soft_skills: [],
                    hard_skills: []
                })
            ])
        );
    });

    it('/api/lifestages/?type=experience&sort=yeardesc/ call with query and sort returns correct data', async () => {
        const response = await request(app).get('/api/lifestages/?type=experience&sort=yeardesc').set('Accept', 'application/json');
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Array);

        let lastValue;
        let valuesDescending;
        for (let i = 0; i < response.body.length; i++) {
            if (lastValue && lastValue < response.body[i].date_start) {
                valuesDescending = false;
                break;
            }
            valuesDescending = true;
            lastValue = response.body[i].date_start;
        };

        expect(valuesDescending).toBeTruthy();
    });

    it('/api/lifestage/ returns nothing as wrong endpoint', () => {
        return request(app).get('/api/lifestage').expect(404);
    });

    it('/api/lifestages/6443fefed7e655211eddc799/ returns correct data', async () => {
        const response = await request(app).get('/api/lifestages/6443fefed7e655211eddc799').set('Accept', 'application/json');
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                date_start: "1999-01-01T10:53:53.000Z",
                date_end: "2006-01-01T10:53:53.000Z",
                title: "1999-2006 – Primary School",
                description: [],
                soft_skills: [],
                hard_skills: [],
                achievements: []
            })
        );
    });

    it('/api/lifestages/999999999999999999999999/ 404 if item not found', () => {
        return request(app).get('/api/lifestages/999999999999999999999999').expect(404);
    });

    it('/api/lifestages/1/ 500 if ID is not ObjectId', () => {
        return request(app).get('/api/lifestages/1').expect(500);
    });
});

describe('POST', () => {
    it('/api/lifestages/ creates new item', async () => {
        const response = await request(app).post('/api/lifestages').send({title: 'test', date_start: "1999-01-01T10:53:53.000Z", date_end: "2006-01-01T10:53:53.000Z"});
        expect(response.status).toEqual(201);
        expect(response.body).toEqual((
            expect.objectContaining({
                date_start: expect.any(String),
                date_end: expect.any(String),
                title: "test"
            })
        ));
    });

    it('/api/lifestages/ errors due to wrong data type', () => {
        return request(app).post('/api/lifestages').send({title: {dataType: 'wrong'}, date_start: "1999-01-01T10:53:53.000Z", date_end: "2006-01-01T10:53:53.000Z"}).expect(500);
    });

    it('/api/lifestages/ errors due to data validation rule', () => {
        // need to do one for each validation rule in model
        // return request(app).post('/').send({ title: "'SELECT * FROM'" }).expect(500); what actually needs blocking
        return request(app).post('/api/lifestages').send({ title: 'test', date_end: "1999-01-01T10:53:53.000Z", date_start: "2006-01-01T10:53:53.000Z"}).expect(500);
    });

    it('/api/lifestages/ errors due to missing data type', () => {
        return request(app).post('/api/lifestages').send({ title: 'test' }).expect(500);
    });
});

describe('PUT', () => {
    it('/api/lifestages/:id/ updates data', async () => {
        const getResponse = await request(app).get('/api/lifestages/?title=test');
        const { _id } = getResponse.body[0];

        const response = await request(app).put(`/api/lifestages/${_id}`).send({title: 'test-update', date_start: "1999-01-01T10:53:53.000Z", date_end: "2006-01-01T10:53:53.000Z"});
        expect(response.status).toEqual(200);
        expect(response.body).toEqual((
            expect.objectContaining({
                date_start: expect.any(String),
                date_end: expect.any(String),
                title: "test-update"
            })
        ));
    });

    it('/api/lifestages/ returns 404 due to no ID', async () => {
        const response = await request(app).put('/api/lifestages').send({title: 'test-update', date_start: "1999-01-01T10:53:53.000Z", date_end: "2006-01-01T10:53:53.000Z"});
        expect(response.status).toEqual(404);
    });

    it('/api/lifestages/:id/ errors due to wrong data type', async () => {
        const getResponse = await request(app).get('/api/lifestages/?title=test-update');
        const { _id } = getResponse.body[0];

        const response = await request(app).put(`/api/lifestages/${_id}`).send({title: {data: "wrong"}, date_start: "1999-01-01T10:53:53.000Z", date_end: "2006-01-01T10:53:53.000Z"});
        expect(response.status).toEqual(500);
    });
});

describe('PATCH', () => {
    it('/api/lifestages/:id/ op=>replace replaces date_start field in data', async () => {
        const getResponse = await request(app).get('/api/lifestages/?title=test-update');
        const { _id } = getResponse.body[0];

        const response = await request(app).patch(`/api/lifestages/${_id}`).send({op: 'replace', path: 'date_start', value: "1998-01-01T10:53:53.000Z"});
        expect(response.status).toEqual(200);
        
        const getResponseAfter = await request(app).get(`/api/lifestages/${_id}`);
        expect(getResponseAfter.body).toEqual((
            expect.objectContaining({
                date_start: "1998-01-01T10:53:53.000Z",
                date_end: expect.any(String),
                title: "test-update"
            })
        ));
    });

    it('/api/lifestages/:id/ op=>add pushes value to array field in data', async () => {
        const getResponse = await request(app).get('/api/lifestages/?title=test-update');
        const { _id } = getResponse.body[0];

        const response = await request(app).patch(`/api/lifestages/${_id}`).send({op: 'add', path: 'achievements', value: 'A*'});
        expect(response.status).toEqual(200);
        
        const getResponseAfter = await request(app).get(`/api/lifestages/${_id}`);
        expect(getResponseAfter.body).toEqual((
            expect.objectContaining({
                date_start: expect.any(String),
                date_end: expect.any(String),
                title: "test-update",
                achievements: ['A*']
            })
        ));
    });

    it('/api/lifestages/:id/ op=>remove removes value from array field in data', async () => {
        const getResponse = await request(app).get('/api/lifestages/?title=test-update');
        const { _id } = getResponse.body[0];

        const response = await request(app).patch(`/api/lifestages/${_id}`).send({op: 'remove', path: 'achievements', value: 'A*'});
        expect(response.status).toEqual(200);
        
        const getResponseAfter = await request(app).get(`/api/lifestages/${_id}`);
        expect(getResponseAfter.body).toEqual((
            expect.objectContaining({
                date_start: expect.any(String),
                date_end: expect.any(String),
                title: "test-update",
                achievements: []
            })
        ));
    });


    it('/api/lifestages/ returns 404 due to no ID', async () => {
        const response = await request(app).patch('/api/lifestages/').send({op: 'remove', path: 'achievements', value: 'A*'});
        expect(response.status).toEqual(404);
    });

    it('/api/lifestages/:id/ returns 500 due to wrong data type', async () => {
        const getResponse = await request(app).get('/api/lifestages/?title=test-update');
        const { _id } = getResponse.body[0];

        const response = await request(app).patch(`/api/lifestages/${_id}`).send({op: 'replace', path: 'date_start', value: {data: "wrong"}});
        expect(response.status).toEqual(500);
    });
});

describe('DELETE', () => {
    it('/api/lifestages/:id/ deletes item by ID', async () => {
        const getResponse = await request(app).get('/api/lifestages/?title=test-update');
        const { _id } = getResponse.body[0];

        const response = await request(app).delete(`/api/lifestages/${_id}`);
        expect(response.status).toEqual(200);
        
        const dataCheck = await request(app).get('/api/lifestages/?title=test-update');
        expect(dataCheck.status).toEqual(404);
    });

    it('/api/lifestages/999999999999999999999999/ returns 404 if ID not found', async () => {
        return request(app).delete('/api/lifestages/999999999999999999999999').expect(404);
    });

    it('/api/lifestages/1/ returns 500 if ID is not ObjectId', () => {
        return request(app).delete('/api/lifestages/1').expect(500);
    });

    it('/api/lifestages/?title=test/ returns 200 and deletes all with title test', async () => {
        await request(app).post('/api/lifestages').send({title: 'test', date_start: "1999-01-01T10:53:53.000Z", date_end: "2006-01-01T10:53:53.000Z"});
        await request(app).post('/api/lifestages').send({title: 'test', date_start: "1999-01-01T10:53:53.000Z", date_end: "2006-01-01T10:53:53.000Z"});
        await request(app).post('/api/lifestages').send({title: 'test', date_start: "1999-01-01T10:53:53.000Z", date_end: "2006-01-01T10:53:53.000Z"});
        
        const getResponse = await request(app).get('/api/lifestages/?title=test');
        const noItemsCalledTest = getResponse.body.length;
        expect(noItemsCalledTest).toEqual(3);

        const response = await request(app).delete('/api/lifestages/?title=test');
        expect(response.status).toEqual(200);
        expect(response.body.deletedCount).toEqual(3);
        
        const dataCheck = await request(app).get('/api/lifestages/?title=test');
        expect(dataCheck.status).toEqual(404);
    });

    it('/api/lifestages/?title=testnotitle/ returns 404 as no data with title testnotitle', () => {
        return request(app).delete('/api/lifestages/?title=testnotitle').expect(404);
    });

    it('/api/lifestages/ returns 500 as not allowed to delete all documents', () => {
        return request(app).delete('/api/lifestages/').expect(500);
    });
});