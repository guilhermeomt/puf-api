import { decodeBasicToken } from './service';

const email = 'ola@guilhermeomt.dev';
const password = '123456';

describe('Users service', () => {
  it('should return credentials by basic authentication token', async () => {
    const token = Buffer.from(`${email}:${password}`, 'utf-8').toString(
      'base64'
    );

    const basicToken = `Basic ${token}`;

    const credentials = decodeBasicToken(basicToken);

    expect(credentials).toEqual([email, password]);
  });

  it('should throw an error when token is not basic type', async () => {
    const token = Buffer.from(`${email}:${password}`, 'utf-8').toString(
      'base64'
    );

    const bearerToken = `Bearer ${token}`;

    const credentials = () => decodeBasicToken(bearerToken);

    expect(credentials).toThrowError('Cabeçalho de autenticação inválido');
  });

  it('should throw an error when credentials are malformed', async () => {
    const token = Buffer.from(`${email}${password}`, 'utf-8').toString(
      'base64'
    );

    const basicToken = `Basic ${token}`;

    const credentials = () => decodeBasicToken(basicToken);

    expect(credentials).toThrowError('Credenciais mal formadas');
  });

  it('should throw an error when credentials are not base64 encoded', async () => {
    const token = `${email}${password}`;

    const basicToken = `Basic ${token}`;

    const credentials = () => decodeBasicToken(basicToken);

    expect(credentials).toThrowError(
      'Credencias não estão codificadas em base64'
    );
  });

  it('should throw an error when credentials are not informed', async () => {
    const credentials = () => decodeBasicToken();

    expect(credentials).toThrowError('Cabeçalho de autenticação não informado');
  });
});
