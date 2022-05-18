import { ApplicationError } from '~/utils/applicationError';

export function decodeBasicToken(authHeader) {
  if (!authHeader)
    throw new ApplicationError(400, 'Cabeçalho de autenticação não informado');

  const [type, credentials] = authHeader.split(' ');

  if (type !== 'Basic')
    throw new ApplicationError(400, 'Cabeçalho de autenticação inválido');

  const decodedCredentials = Buffer.from(credentials, 'base64').toString();
  const encodedCredentials = Buffer.from(decodedCredentials, 'utf-8').toString(
    'base64'
  );

  if (encodedCredentials !== credentials)
    throw new ApplicationError(
      400,
      'Credencias não estão codificadas em base64'
    );

  if (decodedCredentials.indexOf(':') === -1)
    throw new ApplicationError(400, 'Credenciais mal formadas');

  return decodedCredentials.split(':');
}
