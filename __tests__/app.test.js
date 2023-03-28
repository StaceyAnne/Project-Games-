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
describe('200: /api/reviews/:review_id', () => {
    it('should return an object when user inputs a valid review_id endpoint', () => {
        return request(app)
        .get('/api/reviews/5')
        .expect(200)
        .then(({ body }) => {
            const review = body.review; 
            expect(review).toBeInstanceOf(Object)
            expect(review).toMatchObject({
                review_id: expect.any(Number),
                title: expect.any(String),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String), 
                votes: expect.any(Number),
                category: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number)
            })
        })
    })
    it('400: should return an error when user inputs a result id that is not a number', () => {
        return request(app)
        .get('/api/reviews/invalidid')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Invalid request")
        })
    })
     it('404: should return an error when a user inputs a result id that does not exist ', () => {
        return request(app)
        .get('/api/reviews/999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Id does not exist")
        })
    });
})