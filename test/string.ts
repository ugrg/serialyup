/*
 * Author: ugrg
 * Create Time: 2019/10/25 9:30
 */
import { string } from '../src';

describe('string', () => {
  const MESSAGE = '错误消息';
  it('matches', async () => {
    const schema = string().matches(/f1/, MESSAGE);
    return Promise.all([
      schema.validate('f2').catch((message) => expect(message).toBe(MESSAGE)),
      schema.validate('f1').then((value) => expect(value).toBe('f1')),
      schema.remove().validate('f1').then((value) => expect(value).toBeUndefined()),
      schema.remove().validate('f2').catch((message) => expect(message).toBe(MESSAGE))
    ]);
  });
  it('required', async () => {
    const schema = string().required(MESSAGE);
    return Promise.all([
      schema.validate('').catch(message => expect(message).toBe(MESSAGE)),
      schema.validate(null).catch(message => expect(message).toBe(MESSAGE)),
      schema.validate(undefined).catch(message => expect(message).toBe(MESSAGE)),
      schema.validate('123').then(value => expect(value).toBe('123'))
    ]);
  });
  it('length', async () => {
    const schema = string().nullAllow().undefinedAllow().length(5, MESSAGE);
    return Promise.all([
      schema.validate('').catch(message => expect(message).toBe(MESSAGE)),
      schema.validate(null).catch(message => expect(message).toBe(MESSAGE)),
      schema.validate(undefined).catch(message => expect(message).toBe(MESSAGE)),
      schema.validate('12345').then(value => expect(value).toBe('12345'))
    ]);
  });
  it('min', async () => {
    const schema = string().min(5, MESSAGE);
    return Promise.all([
      schema.validate('1234').catch(message => expect(message).toBe(MESSAGE)),
      schema.validate('12345').then(value => expect(value).toBe('12345')),
      schema.validate('123456').then(value => expect(value).toBe('123456'))
    ]);
  });
  it('max', async () => {
    const schema = string().max(5, MESSAGE);
    return Promise.all([
      schema.validate('12346').catch(message => expect(message).toBe(MESSAGE)),
      schema.validate('12345').then(value => expect(value).toBe('12345')),
      schema.validate('1234').then(value => expect(value).toBe('1234'))
    ]);
  });
  it('email', async () => {
    const schema = string().email(MESSAGE);
    return Promise.all([
      schema.validate('').catch(message => expect(message).toBe(MESSAGE)),
      schema.validate('abc.com').catch(message => expect(message).toBe(MESSAGE)),
      schema.validate('abc@abc').catch(message => expect(message).toBe(MESSAGE)),
      schema.validate('abc@.com').catch(message => expect(message).toBe(MESSAGE)),
      schema.validate('abc@abc.com').then(value => expect(value).toBe('abc@abc.com')),
      schema.validate('abc.ef@abc.cn').then(value => expect(value).toBe('abc.ef@abc.cn')),
      schema.validate('abc.ef@abc.com.cn').then(value => expect(value).toBe('abc.ef@abc.com.cn'))
    ]);
  });
  it('url', async () => {
    const schema = string().url(MESSAGE);
    return Promise.all([
      schema.validate('').catch(message => expect(message).toBe(MESSAGE)),
      schema.validate('this is not a url').catch(message => expect(message).toBe(MESSAGE)),
      schema.validate('//www.github.com/').then(value => expect(value).toBe('//www.github.com/')),
      schema.validate('https://www.github.com/').then(value => expect(value).toBe('https://www.github.com/'))
    ]);
  });
  it('ensure', async () => {
    const schema = string().ensure();
    return Promise.all([
      schema.validate().then(value => expect(value).toBe('')),
      schema.validate('1').then(value => expect(value).toBe('1')),
      schema.validate('').then(value => expect(value).toBe(''))
    ]);
  });
  it('lowercase', async () => {
    const schema = string().lowercase();
    return Promise.all([
      schema.validate().then(value => expect(value).toBe('')),
      schema.validate('1').then(value => expect(value).toBe('1')),
      schema.validate('AbC').then(value => expect(value).toBe('abc'))
    ]);
  });
  it('uppercase', async () => {
    const schema = string().uppercase();
    return Promise.all([
      schema.validate().then(value => expect(value).toBe('')),
      schema.validate('1').then(value => expect(value).toBe('1')),
      schema.validate('AbC').then(value => expect(value).toBe('ABC'))
    ]);
  });
  it('trim', async () => {
    const schema = string().trim();
    return Promise.all([
      schema.validate().then(value => expect(value).toBe('')),
      schema.validate(' 1 ').then(value => expect(value).toBe('1')),
      schema.validate('\tabc  ').then(value => expect(value).toBe('abc'))
    ]);
  });
});
