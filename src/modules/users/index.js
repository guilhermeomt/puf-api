import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { prisma } from '~/data';

export const login = async ctx => {
  try {
    const { email, password } = ctx.request.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const passwordEqual = await bcrypt.compare(password, user.password);

    if (!user || !passwordEqual) {
      ctx.status = 404;
      return;
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET);

    ctx.body = { user: { ...user, password: undefined }, token };

    ctx.status = 200;
  } catch (err) {
    ctx.status = 500;
    ctx.body = 'Ops... algo deu errado. Tente novamente mais tarde.';
  }
};

export const list = async ctx => {
  try {
    const users = await prisma.user.findMany();
    ctx.body = users;
  } catch (err) {
    ctx.status = 500;
    ctx.body = 'Ops... algo deu errado. Tente novamente mais tarde.';
  }
};

export const create = async ctx => {
  try {
    const { name, email, password } = ctx.request.body;

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
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
    const user = await prisma.user.update({
      where: {
        id: ctx.params.id,
      },
      data: { name, email },
    });
    ctx.body = user;
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = 'Ops... algo deu errado. Tente novamente mais tarde.';
  }
};

export const remove = async ctx => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: ctx.params.id,
      },
    });
    ctx.body = user;
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = 'Ops... algo deu errado. Tente novamente mais tarde.';
  }
};
