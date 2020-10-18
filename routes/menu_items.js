/*
 * All routes for Menu Items are defined here
 * Since this file is loaded in server.js into api/menu_items,
 *   these routes are mounted onto /menu_items
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM menu_items`;
    console.log(query);
    db.query(query)
      .then(data => {
        const menu_items = data.rows;
        res.json({ menu_items });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
