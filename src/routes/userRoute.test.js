
require('dotenv').config();
const express = require("express");
const userRoute = require("./userRoute");
const request = require("supertest"); // 
const { StatusCodes } = require('http-status-codes');
const { addCustomResponses } = require('../middleware/responseCodes.middleware');

const app = express();
app.use(express.json({ extended: true }));
app.use(addCustomResponses);
app.use("/users", userRoute);
const agent = request.agent(app);

jest.setTimeout(10000);

describe("Testing userRoute", () => {
    it("POST /users - success", async () => {
        let userObj = {
            'name': "Ken",
            'age': 34,
            'email': "11111@gmail.com",
            'password': "000"
        };
        const body = await agent.post("/users").send(userObj);
        expect(StatusCodes.BAD_REQUEST);
        expect(body.text).toEqual("{\"errors\":[],\"message\":\"User with such email has already existed\"}")
    })
});
