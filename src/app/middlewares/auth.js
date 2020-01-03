import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Bearer token
  // desestruturando [bearer,token], como não uso o bearer deixo vazio
  const [, token] = authHeader.split(' ');
  try {
    // ela é uma função de callback, com o promisify transforma ela em promise
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // nos retornamos o payload no sessionController que é o id do usuario
    // console.log(decoded); // tem o id
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
