const express = require('express')
const app = express()
const cors = require('cors');

app.use(cors({ origin: 'http://localhost:5000' }));

const portstart = 3030
const sequelize = require('./database/sequelize');

const select = require('./content/select_test');
const login_seller = require('./content/seller/login_seller');
const login_user = require('./content/user/login_user');
const register_user = require('./content/user/register_user');
const register_seller = require('./content/seller/register_seller');
// const register_admin_orm = require('./content_orm/register_admin');
const authen = require('./content/authen');
const help = require('./content/help');
const roles = require('./content/roles');
// const { getImages } = require('./api/get_images');
const selest_products = require('./content/products/select_products');
const insert_products = require('./content/products/insert_products');

app.use('/test', select);
app.use('/api/login_seller', login_seller);
app.use('/api/login_user', login_user);
app.use('/api/register_user', register_user);
app.use('/api/register_seller', register_seller);
// app.use('/api_orm/register_admin' , register_admin_orm);
app.use('/api/authen', authen);
app.use('/help', help);
app.use('/api/roles', roles);
// app.post('/api/getimages', getImages);
app.use('/api/selest_products', selest_products);
app.use('/api/insert_products', insert_products);

app.get('/', (req, res) => {
  res.send('<h3>/help</h3>')
})

app.listen(portstart, async () => {
  await sequelize.sync()
  console.log('Start server at port ' + portstart + '.')
});