import { beforeEach, afterEach, describe, it, expect } from 'bun:test';
import app from "../src";
import { logger } from '../src/application/logging';
import { UserTest } from './test-util';

describe('[POST] /api/users/register', () => {

    afterEach(async () => {
        await UserTest.delete();
    });

    it('should reject register new user if request is invalid', async () => {
        const response = await app.request('/api/users/register', {
            method: 'post',
            body: JSON.stringify({
                username: "",
                password: "",
                name: ""
            })
        });

        const body = await response.json();
        logger.info(body.errors);

        expect(response.status).toBe(400);
        expect(body.errors).toBeDefined();
    });

    it('should reject register new user if username already exists', async () => {
        await UserTest.create();

        const response = await app.request('/api/users/register', {
            method: 'post',
            body: JSON.stringify({
                username: "test",
                password: "test",
                name: "test"
            })
        });

        const body = await response.json();
        // logger.debug(body);

        expect(response.status).toBe(400);
        expect(body.errors).toBeDefined();
    });

    it('should register new user success', async () => {
        const response = await app.request('/api/users/register', {
            method: 'post',
            body: JSON.stringify({
                username: "test",
                password: "123456",
                name: "test"
            })
        });

        const body = await response.json();
        logger.debug(body);

        expect(response.status).toBe(200);
        expect(body.data).toBeDefined();
        expect(body.data.username).toBe("test");
        expect(body.data.name).toBe("test");
    });

});

describe("[POST] /api/users/login", () => {
    
    afterEach(async () => {
        await UserTest.delete();
    });

    it('should reject login user if request is invalid', async () => {
        const response = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: "",
                password: ""
            })
        });

        const body = await response.json();
        logger.debug(body);

        expect(response.status).toBe(400);
        expect(body.errors).toBeDefined();
    });

    it('should reject login user if username not found', async () => {
        const response = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: "test",
                password: "123456"
            })
        });

        const body = await response.json();
        logger.debug(body);

        expect(response.status).toBe(404);
        expect(body.errors).toBeDefined();
    });

    it('should reject login user success', async () => {
        await UserTest.create();

        const response = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: "test",
                password: "123456"
            }),
            credentials: 'include'
        });

        let token = response.headers.get("Set-cookie")?.split("; ")[0];
        token = token?.split("=")[1];

        console.debug(token);

        expect(response.status).toBe(200);
        expect(token).toBeString();
    });

});

describe("[GET] /api/users/current", () => {
    
    beforeEach(async() => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it("should be able to get user", async () => {
        const token = await UserTest.login();
        
        const response = await app.request("/api/users/current", {
            method: "get",
            credentials: 'include',
            headers: {
                "Cookie": `token=${token}`
            }
        });

        const body = await response.json();
        logger.debug(body);
        
        expect(response.status).toBe(200);
        expect(body.data).toBeDefined();
    });

})