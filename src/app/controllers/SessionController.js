import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async authenticate(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação' });
    }

    const { email, password } = req.body;
    // checar se usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      // 401 não autorizado
      return res.status(401).json({ error: 'User not found' });
    }
    // checar se a senha é válida
    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      // payload, secret que seja unico gobarber, config token
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}
export default new SessionController();
