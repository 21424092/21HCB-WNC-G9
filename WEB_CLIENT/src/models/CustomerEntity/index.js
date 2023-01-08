import Entity from "../Entity";

export default class CustomerEntity extends Entity {
  primaryKey = "customer_id";
  /**
   *
   * @returns {String}
   */
  _fullname() {
    return this.fullname || [this.first_name, this.last_name].join(" ").trim();
  }
}
