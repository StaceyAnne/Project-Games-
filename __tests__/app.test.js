const db = require('../db/connection')
const request = require('supertest')
const app = require('../app')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const jestSorted = require ('jest-sorted')

beforeEach(() => seed(testData))
afterAll(() => {
    return db.end(); 
});



describe('GET /api/categories', () => {
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
describe('GET: /api/reviews/:review_id', () => {
    it('should return an object when user inputs a valid review_id endpoint', () => {
        return request(app)
        .get('/api/reviews/3')
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
                votes: expect.any(Number), 
                comment_count: 3,
            })
        })
    })
    it('400: should return an error when user inputs a result id that is not a number', () => {
        return request(app)
        .get('/api/reviews/invalidid')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Invalid review id")
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
describe('GET /api/reviews', () => {
    it('200: should respond with an array of all review objects', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body; 
            expect(reviews).toHaveLength(13)
            reviews.forEach((review) => {
            expect(review).toBeInstanceOf(Object)
            expect(review).toMatchObject({
                owner: expect.any(String),
                title: expect.any(String),
                review_id : expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(Number),
            })
        })
        })
    })
    it('200: should return an array of all review objects, sorted by date in descending order', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) => {
            const { reviews } = body; 
            expect(reviews).toBeSortedBy('created_at', {
                descending: true,
    }) 
})
    })
it('200: should return the correct number of comments for each review object', () => {
    return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({body}) => {
            const { reviews } = body; 
            const review3 = reviews.filter(review => review.review_id === 3)[0]; 
            expect(review3.comment_count).toBe(3)
        })
})
    it('404: should respond with a 404 error when passed an incorrect file path', () => {
        return request(app)
        .get('/api/review')
        .expect(404)
        .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe('Incorrect file path')
        })
    })
})
describe('GET /api/reviews/:review_id/comments', () => {
    it('200: should return an array of comments for the given review_id', () => {
    return request(app)
    .get('/api/reviews/2/comments')
    .expect(200)
    .then(({ body }) => {
        const { comments } = body; 
        expect(comments).toBeInstanceOf(Array)
        expect(comments).toHaveLength(3)
        comments.forEach((comment) => {
            expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                review_id: expect.any(Number),
            })
        })
    })
})
it('200: should return the correct number of comments for the given review_id', () => {
    return request(app)
    .get('/api/reviews/3/comments')
    .expect(200)
    .then(({ body }) => {
        const { comments } = body; 
        expect(comments.length).toBe(3)
    })   
})
it('200: the returned array should be sorted by most recent comment first ', () => {
    return request(app)
    .get('/api/reviews/2/comments')
    .expect(200)
    .then(({ body }) => {
        const { comments } = body; 
        expect(comments).toBeSortedBy('created_at', {
            descending: true,
        })
    })   
})
it('should return an empty array when the review exists, but the review has no comments', () => {
    return request(app)
    .get('/api/reviews/1/comments')
    .expect(200)
    .then(({ body }) => {
       const { comments } = body; 
       expect(comments).toEqual([])
    })   
});
it('400: should return an error code when passed an incorrect path i.e not a number', () => {
    return request(app)
    .get('/api/reviews/invalidpath/comments')
    .expect(400)
    .then(({ body }) => {
        expect(body.msg).toBe("Invalid review id")
    })
})
it('404: should return an error code when passed a review id that does not exist', () => {
    return request(app)
    .get('/api/reviews/999/comments')
    .expect(404)
    .then(({ body }) => {
        expect(body.msg).toBe("Id does not exist")
    })
})
})

describe.only("POST: /api/reviews/:review_id/comments", () => {
    it("201: should allow user to post an object with a username and body and respond with the posted comment", () => {
        const postBody = { username: "bainesface", body: "This is a great boardgame!" }
        return request(app)
        .post("/api/reviews/2/comments")
        .send(postBody)
        .expect(201)
        .then(( { body } ) => {
         const { comment } = body; 
         expect(comment).toBeInstanceOf(Object)
         expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: "This is a great boardgame!" ,
            review_id: 2,
            author: 'bainesface',
            votes: expect.any(Number),
            created_at: expect.any(String)
         })
    })
})  
    it('404: should return an error when the review id does not exist', () => {
        const postBody = { username: "bainesface", body: "This is a great boardgame!" }
        return request(app)
        .post("/api/reviews/999/comments")
        .send(postBody)
        .expect(404)
        .then(({ body } ) => {
            expect(body.msg).toEqual("Id does not exist")
    });
})
    it('400: should return an error when an invalid path is entered', () => {
        const postBody = { username: "bainesface", body: "This is a great boardgame!" }
        return request(app)
        .post("/api/reviews/invalid/comments")
        .send(postBody)
        .expect(400)
        .then(( { body }) => {
            expect(body.msg).toEqual("Invalid review id")
    });
    });
    it('400: should return an error when the user enters the incorrect format', () => {
        const postBody = { username: "bainesface" }
        const postBody2 = { username: "bainesface", body: "great boardgame!", created_at: "this time"}
            return request(app)
            .post("/api/reviews/3/comments")
            .send(postBody2)
            .expect(400)
            .then((comment) => {
                expect(comment.body.msg).toBe('Invalid input')
    });
})
it('400: should return an error when the user enters an empty object', () => {
    const postBody = {}
    return request(app)
    .post("/api/reviews/3/comments")
    .send(postBody)
    .expect(400)
    .then((comment) => {
        expect(comment.body.msg).toBe('Invalid input')
});
})
})

describe("DELETE /api/comments/:comment_id", () => {
    it('204: should allow the user to delete a comment by the given comment_id and should return no content', () => {
        return request(app)
        .delete('/api/comments/2')
        .expect(204)
        .then((result) => {
            expect(result.body).toEqual({})
            
        return request(app)
        .delete('/api/comments/2')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Id does not exist")
        })
        })

          
    })
    it('404: should return an error when the comment id does not exist', () => {
        return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Id does not exist")
        })
    });
    it('400: should return an error when an invalid file path is entered, i.e not a number', () => {
        return request(app)
        .delete('/api/comments/invalidpath')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Invalid comment id")
        })
    })
})




 describe("PATCH: /api/reviews:/review_id", () => {
        it('200: should allow user to add a positive vote to a review, and return the updated review in the correct format with the increased vote count', () => {
            const input = { inc_votes: 4 }
            return request(app)
            .patch("/api/reviews/3")
            .send(input)
            .expect(200)
            .then(({ body }) => {
                const review = body.review; 
                expect(review).toBeInstanceOf(Object)
                expect(review).toMatchObject({
                    review_id: 3,
                    title: 'Ultimate Werewolf', 
                    review_body: "We couldn't find the werewolf!",
                    category: 'social deduction',
                    designer: 'Akihisa Okui',
                    owner: 'bainesface', 
                    review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
                    created_at: expect.any(String),
                    votes: 9,
            })
        });
    })
    it('200: should allow user to add a negative vote to a review, and return the updated review in the correct format with the descreased vote count', () => {
                const input = { inc_votes: -4 }
                return request(app)
                .patch("/api/reviews/3")
                .send(input)
                .expect(200)
                .then(({ body }) => {
                    const review = body.review; 
                    expect(review).toBeInstanceOf(Object)
                    expect(review).toMatchObject({
                        review_id: 3,
                        title: 'Ultimate Werewolf', 
                        review_body: "We couldn't find the werewolf!",
                        category: 'social deduction',
                        designer: 'Akihisa Okui',
                        owner: 'bainesface', 
                        review_img_url: 'https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700',
                        created_at: expect.any(String),
                        votes: 1
                })
    });
})
    it("400: should return an error when the user inputs an incorrect review id, i.e not a number", () => {
        const input = { inc_votes: 4 }
        return request(app)
        .patch('/api/reviews/invalidpath')
        .send(input)
        .expect(400)
        .then(({ body }) => {
            const { msg } = body; 
            expect(msg).toBe('Invalid review id')
        })
    })
    it('400: should return an error when the user inputs the vote in the incorrect format', () => {
        const input = { votes: 4 }
        return request(app)
        .patch('/api/reviews/4')
        .send(input)
        .expect(400)
        .then(({ body }) => {
            const { msg } = body; 
            expect(msg).toBe('Invalid input')
        })
    })
    it('400: should return an error when the user inputs an empty object', () => {
        const input = {  }
        return request(app)
        .patch('/api/reviews/4')
        .send(input)
        .expect(400)
        .then(({ body }) => {
            const { msg } = body; 
            expect(msg).toBe('Invalid input')
        })
    })
    it('404: should return an error when the review Id does not exist', () => {
        const input = { inc_votes: 4 }
        return request(app)
        .patch('/api/reviews/999')
        .send(input)
        .expect(404)
        .then(({ body }) => {
            const { msg } = body; 
            expect(msg).toBe('Id does not exist')
        })
    })
    })
    describe('GET /api/reviews (queries)', () => {
        it("200: should accept a category query to return all reviews that the queried category ", () => {
            return request(app)
            .get('/api/reviews/?sort_by=social deduction')
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body; 
                expect(reviews).toBeInstanceOf(Array)
                expect(reviews.length).toBe(11)
                })
            })
        it('200: should return an array of reviews for the correct cateogry, with the reviews sorted by date in desc order', () => {
            return request(app)
            .get('/api/reviews/?sort_by=dexterity')
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body; 
                expect(reviews).toBeInstanceOf(Array)
                expect(reviews.length).toBe(1)
                expect(reviews).toBeSortedBy( "created_at", {
                    descending: true 
                })
        })
        })
        it('200: should return an array of reviews for the correct cateogry queried, sorted in the correct order when a sort by query is added', () => {
            return request(app)
            .get('/api/reviews/?sort_by=euro game&order=asc')
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body; 
                expect(reviews).toBeInstanceOf(Array)
                expect(reviews.length).toBe(1)
                expect(reviews).toBeSortedBy( "created_at", {
                    ascending: true 
                })
        })
        })
        it('200: should return an empty array when the catgory exists, but there are no reviews with the queried category', () => {
            return request(app)
            .get('/api/reviews/?sort_by=engine-building')
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body; 
                expect(reviews).toEqual([])
        })
        });
        it('400: should return an error when the user inputs a cateogry that does not exist', () => {
            return request(app)
            .get('/api/reviews/?sort_by=invalidcategory&order=asc')
            .expect(400)
            .then(({ body }) => {
                const { reviews } = body; 
                const { msg } = body;
                expect(msg).toBe("Invalid category")
                
        })
        });
        it('400: should return an error when the user inputs a sort query that does not exist', () => {
            return request(app)
            .get('/api/reviews/?sort_by=euro game&order=ascending')
            .expect(400)
            .then(({ body }) => {
                const { reviews } = body; 
                const { msg } = body;
                expect(msg).toBe("Invalid sort input")
        })
        });
        })
            

        
    

    describe('GET /api/users', () => {
        it('200: should return an array of objects containing the correct properties', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
            const users = body.rows; 
            expect(users).toBeInstanceOf(Array)
            expect(users.length).toBe(4)
            users.forEach((user) => {
            expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
            })
        })
    })
})
        it('404: should return an error when passed an invalid file path', () => { 
            return request(app)
            .get('/api/user')
            .expect(404)
            .then(({ body} ) => {
            expect(body.msg).toBe('Incorrect file path')
        })
    })
})

describe('GET /api/reviews/:review_id (comment count)', () => {
    it('200: returned review object should contain a comment count property', () => {
        return request(app)
        .get('/api/reviews/2')
        .expect(200)
        .then(({ body }) => {
            const commentCount = body.review.comment_count;  
            expect(commentCount).toBe(3)
        })
    });
})

describe.only('GET /api', () => {
    it('should return an array of users', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(( { body }) => {
           expect(body).toBeInstanceOf(Object)
        })
    });
})

