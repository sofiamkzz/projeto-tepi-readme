const User = require('./user');
const Product = require('./product');
const Cart = require('./cart');
const CartItem = require('./cartItem');
const Category = require('./category');
const Order = require('./order');
const Donation = require('./donation');
const Favorite = require('./favorite');

User.hasMany(Cart, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });
User.hasMany(Donation, { foreignKey: 'userId' });
User.hasMany(Favorite, { foreignKey: 'userId' });
User.belongsToMany(Product, { through: 'UserProducts' });

Product.hasMany(CartItem, { foreignKey: 'productId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.hasMany(Favorite, { foreignKey: 'productId' });
Product.belongsToMany(User, { through: 'UserProducts' });

Category.hasMany(Product, { foreignKey: 'categoryId' });

Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId' });

CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsTo(Cart, { foreignKey: 'cartId' });
Order.hasMany(Donation, { foreignKey: 'orderId' });

Donation.belongsTo(User, { foreignKey: 'userId' });
Donation.belongsTo(Order, { foreignKey: 'orderId' });

Favorite.belongsTo(User, { foreignKey: 'userId' });
Favorite.belongsTo(Product, { foreignKey: 'productId' });
