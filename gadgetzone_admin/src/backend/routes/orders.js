import express from 'express';
import orderController from '../controllers/OrderController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/orders/my-orders
 * Fetch current user orders
 */
router.get('/my-orders', authenticateToken, orderController.getMyOrders);

/**
 * GET /api/orders
 * Fetch all orders (admin/gestionnaire)
 */
router.get('/', authenticateToken, requireAdmin, orderController.getAllOrders);

/**
 * GET /api/orders/:id
 * Fetch a specific order
 */
router.get('/:id', authenticateToken, orderController.getOrderById);

/**
 * POST /api/orders
 * Create a new order
 */
router.post('/', authenticateToken, orderController.createOrder);

/**
 * POST /api/orders/calculate-shipping
 * Estimate shipping fees for current cart items
 */
router.post('/calculate-shipping', authenticateToken, orderController.calculateShipping);

/**
 * PUT /api/orders/:id/cancel
 * Cancel an order
 */
router.put('/:id/cancel', authenticateToken, orderController.cancelOrder);

/**
 * PUT /api/orders/:id
 * Update an order (status, etc.)
 */
router.put('/:id', authenticateToken, orderController.updateOrder);

/**
 * DELETE /api/orders/:id
 * Delete an order
 */
router.delete('/:id', authenticateToken, requireAdmin, orderController.deleteOrder);

/**
 * GET /api/orders/track/:orderNumber
 * Publicly track an order status
 */
router.get('/track/:orderNumber', orderController.trackOrderByNumber);

export default router;
