/*
 * Author: ugrg
 * Create Time: 2019/10/24 10:21
 */

class ValidationError extends Error {
  constructor (message, path, name) {
    super();
    this.message = message;
    this.path = path;
    this.name = name;
  }
}

export default ValidationError;
