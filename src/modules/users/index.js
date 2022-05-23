import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { decodeBasicToken } from './service';
import { ApplicationError } from '~/utils/applicationError';
import { User } from './model';

export const login = async ctx => {
  try {
    const [email, password] = decodeBasicToken(
      ctx.request.headers.authorization
    );

    const user = await User.findUnique({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      ctx.status = 404;
      return;
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET);

    ctx.body = { user: { ...user, password: undefined }, token };

    ctx.status = 200;
  } catch (err) {
    console.log(err);
    if (err instanceof ApplicationError) {
      ctx.status = err.statusCode;
      ctx.body = { message: err.message };
    } else {
      ctx.status = 500;
      ctx.body = 'Ops... algo deu errado. Tente novamente mais tarde.';
    }
  }
};

export const list = async ctx => {
  try {
    const users = await User.findMany();
    ctx.body = users;
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = 'Ops... algo deu errado. Tente novamente mais tarde.';
  }
};

export const create = async ctx => {
  try {
    const { name, email, password } = ctx.request.body;

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      data: { name, email, password: hashedPassword },
    });

    ctx.body = { ...user, password: undefined };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = 'Ops... algo deu errado. Tente novamente mais tarde.';
  }
};

export const update = async ctx => {
  try {
    const { name, email } = ctx.request.body;
    const user = await User.update({
      where: {
        id: ctx.params.id,
      },
      data: { name, email },
    });
    ctx.body = { ...user, password: undefined };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = 'Ops... algo deu errado. Tente novamente mais tarde.';
  }
};

export const remove = async ctx => {
  try {
    const user = await User.delete({
      where: {
        id: ctx.params.id,
      },
    });
    ctx.body = { ...user, password: undefined };
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = 'Ops... algo deu errado. Tente novamente mais tarde.';
  }
};
