const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());

app.use(cors({ origin: 'http://localhost:5000' }));

const portstart = 3030
const sequelize = require('./database/sequelize');

const select = require('./content/select_test');
const login_seller = require('./content/seller/login_seller');
const login_user = require('./content/user/login_user');
const register_user = require('./content/user/register_user');
const register_seller = require('./content/seller/register_seller');
const authen = require('./content/authen');
const help = require('./content/help');
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

app.use('/test', select);
app.use('/api/login_seller', login_seller);
app.use('/api/login_user', login_user);
app.use('/api/register_user', register_user);
app.use('/api/register_seller', register_seller);
app.use('/api/authen', authen);
app.use('/help', help);
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

app.get('/', (req, res) => {
  res.send('<h3>/help</h3>')
})

app.listen(portstart, async () => {
  await sequelize.sync()
  // await sequelize.sync({ force: true })
  console.log('Start server at port ' + portstart + '.')
});