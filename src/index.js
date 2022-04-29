import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';

const app = new Koa();
const router = new Router();

router.get('/', ctx => {
  ctx.body = 'Hello World';
});

app.use(bodyParser());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
