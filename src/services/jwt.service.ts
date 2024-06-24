import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as dotenv from "dotenv"
dotenv.config()
@Injectable()
export class JwtService {
    static verifyToken: any;
    generateToken(payload: any, expiresIn:string): string {
        return jwt.sign(payload, process.env.KEY, { expiresIn});
    }

    verifyToken(token: string): any {
        try {
            const parseToken = jwt.verify(token, process.env.KEY)
            return parseToken? true : false;
        } catch (error) {
            return false;
        }
    }
}
