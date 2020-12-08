
require('dotenv').config();
const express = require("express");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const request = require("supertest");
const { StatusCodes } = require('http-status-codes');
const { addCustomResponses } = require('../middleware/responseCodes.middleware');

const app = express();
app.use(express.json({ extended: true }));
app.use(addCustomResponses);
app.use("/users", userRoute);
app.use("/", authRoute);
const agent = request.agent(app);

jest.setTimeout(10000);

describe("Testing userRoute", () => {
    let token;

    beforeAll(async () => {
        let login = {
            'email': "11111@gmail.com",
            'password': "000"
        }
        auth = await agent.post("/auth").send(login);
        token = JSON.parse(auth.text).token;
        agent.set('Authorization', `Bearer ${token}`);
    });

    it("POST /users - already existed", async () => {
        let userObj = {
            'name': "Ken",
            'age': 34,
            'email': "11111@gmail.com",
            'password': "000"
        };
        const res = await agent.post("/users").send(userObj);
        expect(StatusCodes.BAD_REQUEST);
        expect(res.text).toEqual("{\"errors\":[],\"message\":\"User with such email has already existed\"}");
        expect(res).toHaveProperty('req');
    });

    it("GET /users - success", async () => {
        const res = await agent.get("/users");
        expect(StatusCodes.OK);
        let firstUser = JSON.parse(res.text).data.users[0];
        expect(firstUser.id).toEqual(1);
    })
});
