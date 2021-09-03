/*
 * Author: ugrg
 * Create Time: 2019/10/24 10:21
 */

class ValidationError extends Error {
  public path?: string;

  constructor (message: string, path?: string, name = '') {
    super();
    this.message = message;
    this.path = path;
    this.name = name;
  }
}

export default ValidationError;
