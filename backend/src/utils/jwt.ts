import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export const generateJWT = (payload: JwtPayload) => {
    console.log(payload)
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'});
    return token;
};