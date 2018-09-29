import dbConnect from '../config/dbConnect';

/**
 * queries users
 */
class UsersDBQueries {
  /**
   * @static
   * @method createUser
   * @description creates a new user
   * @param {string} firstName - user's first name
   * @param {string} lastName - user's last name
   * @param {string} email - user's email
   * @param {string} password - user's password
   * @returns {object} the new user
   */
  static createUser(firstName, lastName, email, password) {
    const query = `INSERT INTO users (first_name, last_name, email, password)
    VALUES ('${firstName}', '${lastName}', '${email}', '${password}')
    RETURNING user_id, user_role`;

    return dbConnect.query(query).then(resultData => resultData.rows[0]);
  }

  /**
   * @static
   * @method createAdmin
   * @description creates an admin
   * @param {string} firstName - admin's first name
   * @param {string} lastName - admin's last name
   * @param {string} email - admin's email
   * @param {string} password - admin's password
   * @returns {object} the new admin
   */
  static createAdmin(firstName, lastName, email, password) {
    const query = `INSERT INTO users
    (first_name, last_name, email, password, user_role)
    VALUES ('${firstName}', '${lastName}', '${email}', '${password}', 'admin')
    RETURNING user_id, user_role`;

    return dbConnect.query(query).then(resultData => resultData.rows[0]);
  }

  /**
   * @static
   * @method getUserByEmail
   * @description Fetches a user
   * @param {string} email - the user's email
   * @returns {object} a user or undefined if user does not exist
   */
  static getUserByEmail(email) {
    const query = `SELECT * FROM users WHERE email='${email}'`;
    return dbConnect.query(query).then(resultData => resultData.rows[0]);
  }

  /**
   * @static
   * @method deleteAllUsers
   * @description delete all users
   * @returns {undefined} undefined
   */
  static deleteAllUsers() {
    const query = 'DELETE FROM users';
    dbConnect.query(query);
  }
}

export default UsersDBQueries;
