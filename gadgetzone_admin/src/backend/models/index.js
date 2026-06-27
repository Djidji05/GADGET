import sequelize from '../config/database.js';
import Product from './Product.js';
import User from './User.js';
import Address from './Address.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import OrderLog from './OrderLog.js';
import Category from './Category.js';
import Cart from './Cart.js';
import CartItem from './CartItem.js';
import Brand from './Brand.js';
import Expense from './Expense.js';
import Newsletter from './Newsletter.js';
import Campaign from './Campaign.js';
import Page from './Page.js';
import BlogPost from './BlogPost.js';
import Role from './Role.js';
import Notification from './Notification.js';
import Review from './Review.js';
import Store from './Store.js';
import Payout from './Payout.js';
import Banner from './Banner.js';
import HomepageConfig from './HomepageConfig.js';
import Conversation from './Conversation.js';
import Message from './Message.js';
import Promotion from './Promotion.js';
import Deposit from './Deposit.js';
import Referral from './Referral.js';
import Dispute from './Dispute.js';
import DisputeMessage from './DisputeMessage.js';
import Refund from './Refund.js';
import Setting from './Setting.js';
import Offer from './Offer.js';
import AcademyCourse from './AcademyCourse.js';
import Boost from './Boost.js';
import ForumPost from './ForumPost.js';
import ForumComment from './ForumComment.js';
import ForumLike from './ForumLike.js';
import Wallet from './Wallet.js';
import StoreFollower from './StoreFollower.js';
import OrderTracking from './OrderTracking.js';
import SecurityLog from './SecurityLog.js';
import Visit from './Visit.js';
import Wishlist from './Wishlist.js';
import FlashSale from './FlashSale.js';
import LoyaltyAccount from './LoyaltyAccount.js';
import LoyaltyTransaction from './LoyaltyTransaction.js';
import PushSubscription from './PushSubscription.js';
import ReviewVote from './ReviewVote.js';
import Achievement from './Achievement.js';
import UserAchievement from './UserAchievement.js';
import QRPayment from './QRPayment.js';
import OrderPayment from './OrderPayment.js';// Définir les associations
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Order Logs associations
Order.hasMany(OrderLog, { foreignKey: 'order_id', as: 'logs' });
OrderLog.belongsTo(Order, { foreignKey: 'order_id' });

User.hasMany(OrderLog, { foreignKey: 'user_id', as: 'order_logs' });
OrderLog.belongsTo(User, { foreignKey: 'user_id', as: 'actor' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });

// Reviews associations
Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ReviewVote associations
Review.hasMany(ReviewVote, { foreignKey: 'review_id', as: 'votes' });
ReviewVote.belongsTo(Review, { foreignKey: 'review_id' });
User.hasMany(ReviewVote, { foreignKey: 'user_id', as: 'review_votes' });
ReviewVote.belongsTo(User, { foreignKey: 'user_id' });

// PushSubscription associations
User.hasMany(PushSubscription, { foreignKey: 'user_id', as: 'push_subscriptions' });
PushSubscription.belongsTo(User, { foreignKey: 'user_id' });

// UserAchievement associations
User.hasMany(UserAchievement, { foreignKey: 'user_id', as: 'user_achievements' });
UserAchievement.belongsTo(User, { foreignKey: 'user_id' });
Achievement.hasMany(UserAchievement, { foreignKey: 'achievement_id', as: 'user_achievements' });
UserAchievement.belongsTo(Achievement, { foreignKey: 'achievement_id', as: 'achievement' });
User.belongsToMany(Achievement, { through: UserAchievement, foreignKey: 'user_id', as: 'achievements' });
Achievement.belongsToMany(User, { through: UserAchievement, foreignKey: 'achievement_id', as: 'users' });

Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'products' });
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });

Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Category.hasMany(Category, { foreignKey: 'parentId', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

// Store associations
User.hasOne(Store, { foreignKey: 'userId', as: 'store' });
Store.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// Followers associations
User.belongsToMany(Store, { through: StoreFollower, foreignKey: 'userId', as: 'followedStores' });
Store.belongsToMany(User, { through: StoreFollower, foreignKey: 'storeId', as: 'followers' });


Store.hasMany(Product, { foreignKey: 'storeId', as: 'products' });
Product.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

Store.hasMany(Boost, { foreignKey: 'storeId', as: 'boosts' });
Boost.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

Product.hasMany(Boost, { foreignKey: 'productId', as: 'boosts' });
Boost.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Store.hasMany(Payout, { foreignKey: 'storeId', as: 'payouts' });
Payout.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

Store.hasOne(Wallet, { foreignKey: 'storeId', as: 'wallet' });
Wallet.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

Store.hasMany(QRPayment, { foreignKey: 'store_id', as: 'qrPayments' });
QRPayment.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
User.hasMany(QRPayment, { foreignKey: 'payer_user_id', as: 'qrPaymentsPaid' });
QRPayment.belongsTo(User, { foreignKey: 'payer_user_id', as: 'payer' });

Store.hasMany(Promotion, { foreignKey: 'storeId', as: 'promotions' });
Promotion.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

Store.hasMany(Deposit, { foreignKey: 'storeId', as: 'deposits' });
Deposit.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Logistics associations (Phase 13)
Store.hasMany(Order, { foreignKey: 'store_id', as: 'store_orders' });
Order.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

Order.hasMany(OrderPayment, { foreignKey: 'order_id', as: 'payments' });
OrderPayment.belongsTo(Order, { foreignKey: 'order_id' });

Order.hasMany(OrderTracking, { foreignKey: 'order_id', as: 'trackingHistory' });
OrderTracking.belongsTo(Order, { foreignKey: 'order_id' });

// Offer associations (The core of multi-vendor Buy Box)
Product.hasMany(Offer, { foreignKey: 'productId', as: 'offers' });
Offer.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

Store.hasMany(Offer, { foreignKey: 'storeId', as: 'offers' });
Offer.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Cart associations
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

User.hasOne(Cart, { foreignKey: 'customerId' });
Cart.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

// Notification associations
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Address associations
User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Messaging associations
User.hasMany(Conversation, { foreignKey: 'participant1_id', as: 'conversations1' });
User.hasMany(Conversation, { foreignKey: 'participant2_id', as: 'conversations2' });
Conversation.belongsTo(User, { foreignKey: 'participant1_id', as: 'participant1' });
Conversation.belongsTo(User, { foreignKey: 'participant2_id', as: 'participant2' });

Conversation.hasMany(Message, { foreignKey: 'conversation_id', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });

User.hasMany(Message, { foreignKey: 'sender_id', as: 'sent_messages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// Referral associations
User.hasMany(Referral, { foreignKey: 'ambassador_id', as: 'referrals_made' });
Referral.belongsTo(User, { foreignKey: 'ambassador_id', as: 'ambassador' });

User.hasOne(Referral, { foreignKey: 'referred_user_id', as: 'referral_source' });
Referral.belongsTo(User, { foreignKey: 'referred_user_id', as: 'referred_user' });

Order.hasOne(Referral, { foreignKey: 'order_id' });
Referral.belongsTo(Order, { foreignKey: 'order_id' });

// Dispute associations
Order.hasMany(Dispute, { foreignKey: 'order_id', as: 'disputes' });
Dispute.belongsTo(Order, { foreignKey: 'order_id' });

User.hasMany(Dispute, { foreignKey: 'user_id', as: 'disputes_opened' });
Dispute.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });

Dispute.hasMany(DisputeMessage, { foreignKey: 'dispute_id', as: 'messages' });
DisputeMessage.belongsTo(Dispute, { foreignKey: 'dispute_id' });

User.hasMany(DisputeMessage, { foreignKey: 'sender_id', as: 'dispute_messages' });
DisputeMessage.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// Refund associations
Order.hasOne(Refund, { foreignKey: 'order_id', as: 'refund' });
Refund.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

User.hasMany(Refund, { foreignKey: 'user_id', as: 'refunds' });
Refund.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });

Refund.belongsTo(User, { foreignKey: 'processed_by', as: 'processor' });

// Community Forum associations
Store.hasMany(ForumPost, { foreignKey: 'storeId', as: 'forumPosts' });
ForumPost.belongsTo(Store, { foreignKey: 'storeId', as: 'author' });

ForumPost.hasMany(ForumComment, { foreignKey: 'postId', as: 'comments' });
ForumComment.belongsTo(ForumPost, { foreignKey: 'postId', as: 'post' });

Store.hasMany(ForumComment, { foreignKey: 'storeId', as: 'forumComments' });
ForumComment.belongsTo(Store, { foreignKey: 'storeId', as: 'author' });

ForumPost.hasMany(ForumLike, { foreignKey: 'postId', as: 'likes' });
ForumLike.belongsTo(ForumPost, { foreignKey: 'postId', as: 'post' });

Store.hasMany(ForumLike, { foreignKey: 'storeId', as: 'forumLikes' });
ForumLike.belongsTo(Store, { foreignKey: 'storeId', as: 'voter' });


// ─── Wishlist associations ───────────────────────────────────────────────────
User.hasMany(Wishlist, { foreignKey: 'user_id', as: 'wishlistItems' });
Wishlist.belongsTo(User, { foreignKey: 'user_id' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(Wishlist, { foreignKey: 'product_id' });

// ─── FlashSale associations ───────────────────────────────────────────────────
Product.hasMany(FlashSale, { foreignKey: 'product_id', as: 'flashSales' });
FlashSale.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Store.hasMany(FlashSale, { foreignKey: 'store_id', as: 'flashSales' });
FlashSale.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

// ─── Loyalty associations ─────────────────────────────────────────────────────
User.hasOne(LoyaltyAccount, { foreignKey: 'user_id', as: 'loyaltyAccount' });
LoyaltyAccount.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(LoyaltyTransaction, { foreignKey: 'user_id', as: 'loyaltyTransactions' });
LoyaltyTransaction.belongsTo(User, { foreignKey: 'user_id' });
LoyaltyTransaction.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Hooks de Dénormalisation pour la performance "Rocket"
const updateProductBuyBox = async (productId) => {
  if (!productId) return;
  try {
    const bestOffer = await Offer.findOne({
      where: { productId, is_active: true, stock: { [sequelize.Sequelize.Op.gt]: 0 } },
      order: [['sales_count', 'DESC'], ['price', 'ASC']],
      attributes: ['price']
    });
    await Product.update(
      { buy_box_price: bestOffer ? bestOffer.price : null },
      { where: { id: productId } }
    );
  } catch (error) {
    console.error(`❌ Hook BuyBox Error [Product:${productId}]:`, error.message);
  }
};

const updateProductSalesCount = async (productId) => {
  if (!productId) return;
  try {
    const totalSales = await OrderItem.sum('quantity', {
      where: { product_id: productId }
    });
    await Product.update(
      { sales_count: totalSales || 0 },
      { where: { id: productId } }
    );
  } catch (error) {
    console.error(`❌ Hook SalesCount Error [Product:${productId}]:`, error.message);
  }
};

// Hooks Offer -> Product.buy_box_price
Offer.afterCreate(async (offer) => { await updateProductBuyBox(offer.productId); });
Offer.afterUpdate(async (offer) => { await updateProductBuyBox(offer.productId); });
Offer.afterDestroy(async (offer) => { await updateProductBuyBox(offer.productId); });

// Hooks OrderItem -> Product.sales_count
OrderItem.afterCreate(async (item) => { await updateProductSalesCount(item.product_id); });
OrderItem.afterUpdate(async (item) => { await updateProductSalesCount(item.product_id); });
OrderItem.afterDestroy(async (item) => { await updateProductSalesCount(item.product_id); });

const db = {
  sequelize,
  Sequelize: sequelize.Sequelize,
  Product,

  User,
  Address,
  Order,
  OrderItem,
  Category,
  Cart,
  CartItem,
  Brand,
  Expense,
  Newsletter,
  Campaign,
  Page,
  BlogPost,
  Role,
  Notification,
  Review,
  Store,
  Payout,
  OrderLog,
  Banner,
  HomepageConfig,
  Conversation,
  Message,
  Promotion,
  Deposit,
  Referral,
  Dispute,
  DisputeMessage,
  Refund,
  Setting,
  Offer,
  Boost,
  ForumPost,
  ForumComment,
  ForumLike,
  Wallet,
  StoreFollower,
  OrderTracking,
  SecurityLog,
  Visit,
  Wishlist,
  FlashSale,
  LoyaltyAccount,
  LoyaltyTransaction,
  PushSubscription,
  Achievement,
  UserAchievement,
  QRPayment,
  OrderPayment
};


export { sequelize, Product, User, Address, Order, OrderItem, Category, Cart, CartItem, Brand, Expense, Newsletter, Campaign, Page, BlogPost, Role, Notification, Review, Store, Payout, OrderLog, Banner, HomepageConfig, Conversation, Message, Promotion, Deposit, Referral, Dispute, DisputeMessage, Refund, Setting, Offer, Boost, ForumPost, ForumComment, ForumLike, Wallet, StoreFollower, OrderTracking, SecurityLog, Visit, Wishlist, FlashSale, LoyaltyAccount, LoyaltyTransaction, PushSubscription, ReviewVote, Achievement, UserAchievement, QRPayment, OrderPayment };

export default db;
