import Entity from '../Entity';

export default class CustomerEntity extends Entity
{
  /**
   * @var {String} Primary Key
   */
  primaryKey = 'customer_id';

  _fullname()
  {
    return this.fullname || [
      this.first_name,
      this.last_name
    ].join(' ').trim();
  }
}