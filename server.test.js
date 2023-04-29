const request = require('supertest');
const app = require('./app');

describe('Server', () => {
    it('Should not store user sensitive or identifying data on the user\'s browser in session data or cookies', () => {

    });

    it('Should block any potential injection attacks by escaping text and blocking chars', () => {

    });
});