const request = require("supertest");
const app = require("../../server.js");


describe("My Wishlists Route Test", () =>{
    it('should return a wishlist', (done) => {
        let user_Id=1;
        request(app)
        .get(`/api/wishlists?user_Id=${user_Id}`)
        .set('Accept','application/json')
        .expect('Content-Type', /json/)
        .then((response)=>{
            expect(response.statusCode).toBe(200);
            done();
            })
            });
})

