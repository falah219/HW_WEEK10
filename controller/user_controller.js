const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


class UserController {

    static async getAll(req,res,next) {
        try {
            const users = await User.findAll()
            res.status(200).json(users)
        } catch (error) {
            next(error)
        }
    }

    static async register(req, res, next) {
        try {
            const { email, name, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                email,
                name,
                password: hashedPassword,
            });

            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ where: { email } });
          if (!user) {
            throw {name: 'InvalidCredential'};
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            throw {name: 'InvalidCredential'};
          }
          const token = jwt.sign({id: user.id}, process.env.SECRET_KEY);
          // res.status(200).json({ token });
          res
            .cookie('access_token', token, {http_only:true})
            .status(200)
            .json(token);
        } catch (err) {
          next(err);
        }
      }

}

module.exports = UserController