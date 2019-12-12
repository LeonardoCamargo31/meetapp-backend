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
      confirmPassword: Yup.string().when('password', (password, field) => {
        return password ? field.required().oneOf([Yup.ref('password')]) : field;
      }),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation error' });
    }

    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    const resp = await user.save();
    return res.status(200).json(resp);
  }
}
export default new UserController();
