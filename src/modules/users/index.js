import { prisma } from '~/data/index';

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
    const user = await prisma.user.create({
      data: ctx.request.body,
    });
    ctx.body = user;
  } catch (err) {
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
