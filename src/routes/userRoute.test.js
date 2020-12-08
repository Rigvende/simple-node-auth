
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
    let id;

    beforeAll(async () => {
        let login = {
            'email': "123@yandex.by",
            'password': "123"
        }
        auth = await agent.post("/auth").send(login);
        token = JSON.parse(auth.text).token;
        agent.set('Authorization', `Bearer ${token}`);
    });

    it("POST /users - already existed", async () => {
        let userObj = {
            'name': "Ken",
            'age': 34,
            'email': "000@gmail.com",
            'password': "00dfalj0"
        };
        const res = await agent.post("/users").send(userObj);
        expect(StatusCodes.BAD_REQUEST);
        expect(res.text).toEqual("{\"errors\":[],\"message\":\"User with such email has already existed\"}");
        expect(res).toHaveProperty('req');
    });

    it("POST /users - success", async () => {
        let userObj = {
            'name': "Ken",
            'age': 34,
            'email': "aaa@gmail.com",
            'password': "aaa"
        };
        const res = await agent.post("/users").send(userObj);
        expect(StatusCodes.CREATED);
        id = JSON.parse(res.text).data.id;
        let actual = JSON.parse(res.text).data;
        expect(actual.name).toEqual("Ken");
        expect(actual.age).toEqual(34);
    });

    it("PATCH /users/id - success", async () => {
        let userObj = {
            'name': "Ken",
            'age': 44
        };
        const res = await agent.patch(`/users/${id}`).send(userObj);
        expect(StatusCodes.OK);
    });

    it(`DELETE /users/id - success`, async () => {
        await agent.delete(`/users/${id}`);
        expect(StatusCodes.OK);
    });

    it("GET /users - success", async () => {
        const res = await agent.get("/users");
        expect(StatusCodes.OK);
        let firstUser = JSON.parse(res.text).data.users[0];
        expect(firstUser.id).toEqual(1);
    });

    it("GET /users/id - success", async () => {
        const res = await agent.get(`/users/1`);
        expect(StatusCodes.OK);
        let user = JSON.parse(res.text).data.user;
        expect(user.createdAt).toEqual("2020-11-26T13:13:34.084Z");
    });
});
