const db = require('../db/connection')
const request = require('supertest')
const app = require('../app')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

beforeEach(() => seed(testData))
afterAll(() => {
    return db.end(); 
});



describe('get /api/categories', () => {
    it('should respond with a 200 status and an array of category objects ', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({ body }) => {
            const { categories } = body; 
            expect(categories).toBeInstanceOf(Array)
            expect(categories).toHaveLength(4)
            categories.forEach((category) => {
                expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })   
        }) 
    });
    it('should return a 404 error and a message of invalid query when passed an incorrect path name', () => {
        return request(app)
        .get('/api/incorrectpath')
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Incorrect file path")
        })  
    });
});

