const request = require('supertest');
const app = require('./app');
const qs = require('qs');


describe('Server', () => {
    it('Should not store user sensitive or identifying data on the user\'s browser in session data or cookies', () => {

    });

    it('Should block any potential injection attacks by escaping text and blocking chars', () => {

    });

    it('Should parse foo=bar%2Cbaz as {foo: ["bar","baz"]}', () => {
        const parsed = qs.parse(decodeURIComponent("foo=bar%2Cbaz"), {comma: true});
        expect(parsed).toEqual({foo: ['bar','baz']});
    });
});