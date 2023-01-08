//
import Entity from '../Entity';

/**
 * @class UserEntity
 */
export default class UserEntity extends Entity
{
  /**
   * @var {String} Primary Key
   */
  primaryKey = 'user_id';

  /**
   * 
   * @param {object} data 
   */
  // constructor(data) { super(data); }

  /**
   * 
   * @returns {String}
   */
  key()
  {
    let key = this.tel || Math.random().toString();
    return key;
  }

  /**
   * 
   * @returns {String}
   */
  _fullname()
  {
    return this.fullname || [
      this.first_name,
      this.last_name
    ].join(' ').trim();
  }

  /**
   * @TODO:
   * @returns {Boolean}
   */
  _isAdministrator()
  {
    let prop = 'isAdministrator';
    if (prop in this) {
      return !!this[prop];
    }
    return ('administrator' === this.user_name);
  }

  /**
   * @TODO:
   * @returns {Array}
   */
  getFunctions()
  {
    return this._functions || [];
  }
}