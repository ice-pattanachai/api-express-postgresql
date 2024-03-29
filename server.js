const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());

app.use(cors({ origin: 'http://localhost:5001' }));

const portstart = 3030
const sequelize = require('./database/sequelize');

const select = require('./content/select_test');
const login_seller = require('./content/seller/login_seller');
const login_user = require('./content/user/login_user');
const register_user = require('./content/user/register_user');
const register_seller = require('./content/seller/register_seller');
const authen = require('./content/authen');
const roles = require('./content/roles');
const ProductSearchAll = require('./content/products/search_all');
const ProductSearchID = require('./content/products/search_id');
const ProductInsert = require('./content/products/insert_products');
const ProductUpdate = require('./content/products/edit_products');
const SearchIdUser = require('./content/user/search_id');
const SearchIdSeller = require('./content/seller/search_id');
const SellerUpdate = require('./content/seller/edit_seller');
const UserUpdate = require('./content/user/edit_user');
const AssressesUserInsert = require('./content/user/addresses');
const CheckPassword = require('./content/check_password');
const PurchaseOrders = require('./content/products/purchase_orders');
const Receipt = require('./content/products/receipt');
const timeserver = require('./content/time');
const shop = require('./content/shop/addresses');

app.use('/test', select);
app.use('/api/login_seller', login_seller);
app.use('/api/login_user', login_user);
app.use('/api/register_user', register_user);
app.use('/api/register_seller', register_seller);
app.use('/api/authen', authen);
app.use('/api/roles', roles);
app.use('/api/products_all', ProductSearchAll);
app.use('/api/products_id', ProductSearchID);
app.use('/api/add_product', ProductInsert);
app.use('/api/products_edit', ProductUpdate);
app.use('/api/user_id', SearchIdUser);
app.use('/api/seller_id', SearchIdSeller);
app.use('/api/edit_seller', SellerUpdate);
app.use('/api/edit_user', UserUpdate);
app.use('/api/assresses_user', AssressesUserInsert);
app.use('/api/check_password', CheckPassword);
app.use('/api/purchase_orders', PurchaseOrders)
app.use('/api/receipt', Receipt)
app.use('/api/time', timeserver)
app.use('/api/shop', shop)

app.get('/', (req, res) => {
  res.send('<h3>/help</h3>')
})

app.listen(portstart, async () => {
  await sequelize.sync()
  // await sequelize.sync({ force: true })
  // await sequelize.sync({ alter: true })
  console.log('Start server at port ' + portstart + '.')
  console.log(`[${new Date().toLocaleString()}] Request received`);
});