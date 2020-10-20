/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const db = require('../db/connection/db-conn');
const orderItemsHelpers = require("../helperfunctions/orderItemsHelpers");

module.exports = (router, helpers) => {
  // Get all orders
  router.get("/", (req, res) => {
    helpers.getAllOrders()
      .then(data => {
        const orders = data.rows;
        res.json({ orders });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Add item to order
  router.post('/add/:id', function(req, res) {
    const menu_item_id = req.params.id;
    const user_id = 1;
    console.log(menu_item_id);
    helpers.getUserCart(menu_item_id).then(data => {
      //console.log(data);
      return data;
    })
      .then(data => {
        //determine if item already exists in user cart
        const orderItemExists = orderItemsHelpers.getMenuItemFromCart(data, menu_item_id);
        if (orderItemExists) {
          //increment item count
          //console.log("item exists");
          helpers.incrementCartItem(data, menu_item_id);
        } else {
          //add item
          //console.log("item does not exist");
          helpers.addCartItem(data, menu_item_id);
        }
      }
      )
      .then(
        res.redirect('/')
      ).catch(err => {
        // res
        //   .status(500)
        //   .json({ error: err.message });
      });
    // );
  });
  router.post('/remove/:id', function(req, res) {
    const menu_item_id = req.params.id;
    const user_id = 1;
    helpers.getUserCart(menu_item_id).then(data => {
      //console.log(data);
      return data;
    }).then(data => {
      console.log(menu_item_id);
      cartItemHelpers.addItemToCart(data, menu_item_id);
    }
    )
      .then(
        res.redirect('/')
      ).catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    // );
  });

  // Edit POST /cheeses/:id
  // app.post('/cheeses/:id', (req, res) => {
  //   const name = req.body.name;
  //   const cheeseId = req.params.id;

  //   cheeseDb[cheeseId].name = name;

  //   res.redirect(`/cheeses/${cheeseId}`);
  // });

  // Delete POST /cheeses/:id/delete
  // app.post('/cheeses/:id/delete', (req, res) => {
  //   const cheeseId = req.params.id;
  //   delete cheeseDb[cheeseId];

  //   res.redirect('/cheeses');
  // });
  //Remove item from order
  // router.get('/removeitem', function(req, res) {

  // });




  router.get('/:id', (req, res) => {
    const order_id = req.params.id;
    return db.query(`
    SELECT orders.id as order_id, users.first_name
    FROM orders
    JOIN users ON orders.user_id = users.id
    WHERE orders.id = $1
    `, [order_id])
      .then((data) => {
        console.log(data.rows[0]);
        res.render('order', data.rows[0]);
        return data.rows;
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};


