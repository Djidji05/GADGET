import { Order } from './src/backend/models/index.js';

async function check() {
  const orders = await Order.findAll({
    order: [['id', 'DESC']],
    limit: 5,
    raw: true
  });
  console.log(orders);
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
