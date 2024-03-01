const connection =require("../models/db")

const search = (req, res) => {
  const searchTerm = req.params.searchTerm;
  
  const searchUsers = new Promise((resolve, reject) => {
    const userSql = `SELECT * FROM users WHERE username LIKE '%${searchTerm}%'`;
    connection.query(userSql, (error, users) => {
      if (error) {
        reject({ type: 'users', error });
      } else {
        resolve({ type: 'users', data: users });
      }
    });
  });
  
  const searchPosts = new Promise((resolve, reject) => {
    const postSql = 'SELECT * FROM posts WHERE content LIKE ?';
    const searchValue = `%${searchTerm}%`;
    connection.query(postSql, [searchValue], (error, posts) => {
      if (error) {
        reject({ type: 'posts', error });
      } else {
        resolve({ type: 'posts', data: posts });
      }
    });
  });

  Promise.all([searchUsers, searchPosts])
    .then((results) => {
      const searchData = {};
      results.forEach(({ type, data }) => {
        searchData[type] = data;
      });
      console.log('Retrieved data:', searchData);
      res.status(200).json(searchData);
    })
    .catch((errors) => {
      console.error('Error executing query:', errors);
      res.status(500).json({ message: 'Failed to retrieve data' });
    });
};

module.exports = { search };




