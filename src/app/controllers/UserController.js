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
}
export default new UserController();
