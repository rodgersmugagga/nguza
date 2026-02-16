import Order from '../models/order.model.js';
import Product from '../models/product.model.js'; // Ensure stock is updated

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x.product,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      statusHistory: [{
        status: 'Pending',
        description: 'Order placed successfully'
      }]
    });

    const createdOrder = await order.save();

    // Decrease stock (Optional: Can be done here or after payment confirmation)
    // for (const item of orderItems) {
    //   const product = await Product.findById(item.product);
    //   if (product) {
    //     product.countInStock -= item.quantity;
    //     await product.save();
    //   }
    // }

    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'username email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
export const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    // Only reduce stock when paid if not done at creation
    if (order.status === 'Pending') {
      order.status = 'Processing';
      order.statusHistory.push({
        status: 'Processing',
        description: 'Payment confirmed. Order is being processed.'
      });
    } else {
      order.statusHistory.push({
        status: order.status,
        description: 'Payment information updated.'
      });
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // order.isDelivered = true; // Removed redundant toggle if status is source of truth
    order.deliveredAt = Date.now();
    order.status = 'Delivered';
    order.statusHistory.push({
      status: 'Delivered',
      description: 'Package delivered to customer.'
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Update order status (Admin/Seller)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status, description } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    order.statusHistory.push({
      status: status,
      description: description || `Order status updated to ${status}`
    });

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    if (status === 'Cancelled') {
      order.cancellationReason = description;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id username');
  res.json(orders);
};
