const User = require('./user');
const Product = require('./produto');
const CartItem = require('./item-carrinho');
const Order = require('./pedido');
const OrderItem = require('./item-pedido');
const Favorite = require('./favorites');
const Category = require('./categoria');

// Relacionamentos de Usuario
User.hasMany(CartItem, { foreignKey: 'userId' });  // Um usuário pode ter muitos itens no carrinho
User.belongsToMany(Product, { through: Favorite, foreignKey: 'userId' }); // Um usuário pode favoritar vários produtos

// Relacionamentos de Produto
Product.belongsTo(Category, { foreignKey: 'idCategory', onDelete: 'SET NULL' });  // Produto pertence a uma categoria
Product.hasMany(CartItem, { foreignKey: 'productId' });  // Um produto pode estar em muitos itens de carrinho
Product.belongsToMany(User, { through: Favorite, foreignKey: 'productId' }); // Muitos usuários podem favoritar um produto
Product.hasMany(OrderItem, { foreignKey: 'productId' });  // Um produto pode estar em muitos itens de pedidos

// Relacionamentos de Carrinho
CartItem.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });  // Item de carrinho pertence a um produto
CartItem.belongsTo(User, { foreignKey: 'userId' });  // Item de carrinho pertence a um usuário

// Relacionamentos de Pedido
Order.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });  // Pedido pertence a um usuário
User.hasMany(Order, { foreignKey: 'userId' });  // Um usuário pode ter muitos pedidos

// Relacionamentos de Itens de Pedido
OrderItem.belongsTo(Order, { foreignKey: 'orderId', onDelete: 'CASCADE' });  // Item de pedido pertence a um pedido
OrderItem.belongsTo(Product, { foreignKey: 'productId', onDelete: 'CASCADE' });  // Item de pedido pertence a um produto

module.exports = {
  User,
  Product,
  CartItem,
  Order,
  OrderItem,
  Favorite,
  Category
};
