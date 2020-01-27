import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async save(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(3),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation error' });
    }
    const user = new User(req.body);
    const { name, email } = await user.save();
    return res.status(200).json({ name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().min(3),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) => {
          return oldPassword ? field.required() : field;
        }),
      confirmPassword: Yup.string().when('password', (password, field) => {
        return password ? field.required().oneOf([Yup.ref('password')]) : field;
      }),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation error' });
    }

    const { oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    // se ele estiver atualizando a senha, comparo se a senha antiga esta correta
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'password does not match' });
    }

    await user.update(req.body);

    return res.status(200).json({ title: 'password updated successfully' });
  }
}
export default new UserController();
