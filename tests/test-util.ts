import {prismaClient} from "../src/application/database";
import app from "../src";

export class UserTest {

    static async create() {
        await prismaClient.user.create({
            data: {
                username: "test",
                name: "test",
                password: await Bun.password.hash("123456", {
                    algorithm: "bcrypt",
                    cost: 10
                })
            }
        });
    }

    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                username: "test"
            }
        });
    }

    static async login() {
        const response = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: "test",
                password: "123456"
            }),
            credentials: 'include'
        });

        const token = response.headers.get("Set-cookie")?.split("; ")[0];
        
        return token?.split("=")[1];
    }

}