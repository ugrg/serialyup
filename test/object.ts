/*
 * Author: ugrg
 * Create Time: 2019/10/24 17:30
 */

import { object, string } from '../src/';

describe('object', () => {
  const setup = () => object({
    v1: string().matches(/v1/, '检测到不是v1'),
    v2: object({
      v3: string().undefinedAllow().required('必须含有v3')
    })
  });
  it('对像分发', async () => {
    const schema = setup();
    const testValue = { v1: 'v1', v2: { v3: 'true' } };
    return schema.validate(testValue).then((values) => {
      expect(values).toEqual(testValue);
    });
  });
  it('对像分发异常检测', async () => {
    const schema = setup();
    const testValue = { v1: 'v1', v2: {} };
    return schema.validate(testValue).catch((errors) => {
      const { v2: { v3: message } } = errors;
      expect(message).toEqual('必须含有v3');
    });
  });
  it('shape', async () => {
    const schema = object().shape(setup());
    const testValue = { v1: 'v1', v2: { v3: 'true' } };
    return schema.validate(testValue).then((values) => {
      expect(values).toEqual(testValue);
    });
  });
  it('exact', async () => {
    const schema = object().exact(setup(), 'exact test');
    const testValue = { v1: 'v1', v2: { v3: 'true' }, v4: 'test' };
    return schema.validate(testValue).catch((errors) => expect(errors).toEqual('exact test'));
  });
  it('when', async () => {
    const schema = object({
      v1: string(),
      v2: string().when('v1', {
        is: 'v1',
        then: string().matches(/v\d/, 'when is v1 then'),
        otherwise: string().matches(/V\d/, 'when not is v1 otherwise')
      })
    });
    return Promise.all([
      schema.validate({ v1: 'v1', v2: 'v2', v3: 'v3' })
        .then(result => expect(result).toEqual({ v1: 'v1', v2: 'v2', v3: 'v3' })),
      schema.validate({ v1: 'v1', v2: 'v2' })
        .then(result => expect(result).toEqual({ v1: 'v1', v2: 'v2' })),
      schema.validate({ v1: 'v1', v2: 's1' })
        .catch(({ v2: message }) => expect(message).toBe('when is v1 then')),
      schema.validate({ v1: 'v2', v2: 'V1' })
        .then(result => expect(result).toEqual({ v1: 'v2', v2: 'V1' })),
      schema.validate({ v1: 'v2', v2: 'S1' })
        .catch(({ v2: message }) => expect(message).toBe('when not is v1 otherwise'))
    ]);
  });
});
