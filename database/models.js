const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
require('dotenv').config();

const Product = sequelize.define('product', {
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    price_per_piece: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, { schema: process.env.SCHEMA, });

const Categories = sequelize.define('categories', {
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { schema: process.env.SCHEMA, });

const Images = sequelize.define('images', {
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { schema: process.env.SCHEMA, });

const Promotion = sequelize.define('promotion', {
    code_promotion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    percent: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time_percent: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, { schema: process.env.SCHEMA, });

const Seller = sequelize.define('seller', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { schema: process.env.SCHEMA, })

const Users = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, { schema: process.env.SCHEMA, })

const Addresses = sequelize.define('addresses', {
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postalcode: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { schema: process.env.SCHEMA, })

const LoginHistory = sequelize.define('login_history', {
    login_time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { schema: process.env.SCHEMA })

const Roles = sequelize.define('roles', {
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, { schema: process.env.SCHEMA })

const Receipt = sequelize.define('receipt', {
    order_receipt_number: { //เลขใบสั่งซื้อ คิดว่าจะเอาtime กับ ราคารวมสินค้ามาเขียน
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    receipt_make_payment: { //ชำระเงิน  true = ชำระ fase = ยังไม่ชำระ
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
    },
    receipt_visibility: { //ชำระเงิน  true = เห็น  fase = ไม่เห็น ไว้แสดงในส่วน user 
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
    },
    receipt_status: { //สถานะ บิล true = ปกติ flase = ยกเลิกบิล/ยกเลิกการสั่งซื้อ
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
    },
    receipt_confirm_payment: {
        type: DataTypes.BOOLEAN, // true = ชำระเงินเสร็จสิน false = ยังไม่จำะเงิน   ให้ตัดออกมาจก purchase_orders confirm_payment
        allowNull: false,
    }
}, { schema: process.env.SCHEMA })

const PurchaseOrders = sequelize.define('purchase_orders', {
    addresses_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postalcode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    parcel_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    payment_format: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    confirm_payment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }

}, { schema: process.env.SCHEMA, })

const Set = sequelize.define('sets_up_shop', {
    shopname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    img_promptpay_path: {
        type: DataTypes.STRING,
        allowNull: true,
    },

}, { schema: process.env.SCHEMA, })

Product.hasMany(Categories, { foreignKey: 'product_id', targetKey: 'id' });
Categories.belongsTo(Product, { foreignKey: 'product_id', sourceKey: 'id' });

Product.hasMany(Images, { foreignKey: 'product_id', targetKey: 'id' });
Images.belongsTo(Product, { foreignKey: 'product_id', sourceKey: 'id' });

Product.hasMany(Promotion, { foreignKey: 'product_id', targetKey: 'id' });
Promotion.belongsTo(Product, { foreignKey: 'product_id', sourceKey: 'id' });

// Seller.hasMany(LoginHistory, { foreignKey: 'seller_id', targetKey: 'id' });
// LoginHistory.belongsTo(Seller, { foreignKey: 'seller_id', sourceKey: 'id' });

Users.hasMany(LoginHistory, { foreignKey: 'users_id', targetKey: 'id' });
LoginHistory.belongsTo(Users, { foreignKey: 'users_id', sourceKey: 'id' });

// Roles.hasMany(Users, { foreignKey: 'roles_id', targetKey: 'id' });
// Users.belongsTo(Roles, { foreignKey: 'roles_id', sourceKey: 'id' });

Users.hasMany(Addresses, { foreignKey: 'user_id', targetKey: 'id' });
Addresses.belongsTo(Users, { foreignKey: 'user_id', sourceKey: 'id' });

Users.hasMany(PurchaseOrders, { foreignKey: 'user_id', targetKey: 'id' });
PurchaseOrders.belongsTo(Users, { foreignKey: 'user_id', sourceKey: 'id' });

Product.hasMany(PurchaseOrders, { foreignKey: 'product_id', targetKey: 'id' });
PurchaseOrders.belongsTo(Product, { foreignKey: 'product_id', sourceKey: 'id' });

PurchaseOrders.hasMany(Receipt, { foreignKey: 'receipt_id', targetKey: 'id' });
Receipt.belongsTo(PurchaseOrders, { foreignKey: 'receipt_id', sourceKey: 'id' });

module.exports = {
    Product,
    Categories,
    Images,
    Promotion,
    Seller,
    Users,
    LoginHistory,
    Roles,
    Addresses,
    PurchaseOrders,
    Set,
    Receipt
};