const mongoose = require('mongoose');
const Order = require('../../models/order/orderModel');
const OrderItem = require('../../models/order/orderItemModel');
const OrderAddress = require('../../models/order/orderAddressModel');
const ItemModel = require('../../models/MenuItem/ItemModel');
const ListTwoJoinService = require('../../services/common/ListTwoJoinService');

// POST request to create a new order
const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const {
      customerId,
      orderType,
      paymentMethod,
      deliveryAddress,
      orderItems,
      orderNote,
    } = req.body;

    // Calculate total order amount and discount amount
    let totalAmount = 0;
    let discountAmount = 0;

    const orderItemPromises = orderItems.map(async (item) => {
      const { itemId, quantity } = item;
      const orderItem = await ItemModel.findById(itemId);

      const productPrice = orderItem.UnitPrice;
      const discountPercentage = orderItem.Discount;

      const itemDiscountAmount = (productPrice * discountPercentage) / 100;
      const totalPriceWithDiscount = productPrice - itemDiscountAmount;
      totalAmount += totalPriceWithDiscount * quantity;
      discountAmount += itemDiscountAmount * quantity;
    });

    // Wait for all the order item promises to complete concurrently
    await Promise.all(orderItemPromises);

    // Check if the delivery address is a new address (not selected from existing addresses)
    // Create the new address and associate it with the customer
    const NewOrderAddress = new OrderAddress({
      address: deliveryAddress.address,
      address_type: deliveryAddress.address_type,
      floor: deliveryAddress.floor,
      house: deliveryAddress.house,
      lat: deliveryAddress.lat,
      lng: deliveryAddress.lng,
      road: deliveryAddress.road,
    });
    await NewOrderAddress.save({ session });

    // Create the order
    const order = new Order({
      customerId,
      addressId: NewOrderAddress._id,
      orderType,
      paymentMethod,
      discountAmount,
      orderAmount: totalAmount,
      orderNote,
    });

    // Save the order to the database
    await order.save({ session });

    // Create order items and associate them with the order
    const createOrderItemPromises = orderItems.map(async (item) => {
      const { itemId, quantity } = item;
      const orderItem = await ItemModel.findOne({ _id: itemId });
      return OrderItem.create(
        [
          {
            orderId: order._id,
            productId: orderItem._id,
            quantity,
            price: orderItem.UnitPrice,
          },
        ],
        { session },
      );
    });

    // Wait for all the order item promises to complete concurrently
    await Promise.all(createOrderItemPromises);

    // Transaction Success
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ status: 'success', data: order });
  } catch (error) {
    // Transaction Failed
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      status: 'error',
      message: 'Failed to create the order.',
      error: error.message,
    });
  }
};

const findAllOrders = async (req, res) => {
  try {
    const result = await Order.find();
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    res.status(200).json({ status: 'success', data: error });
  }
};

const findOrderList = async (req, res) => {
  const SearchRgx = { $regex: req.params.searchKeyword, $options: 'i' };
  const JoinStage1 = {
    $lookup: {
      from: 'customers',
      localField: 'customerId',
      foreignField: '_id',
      as: 'info',
    },
  };
  const JoinStage2 = {
    $lookup: {
      from: 'orderaddresses',
      localField: 'addressId',
      foreignField: '_id',
      as: 'address',
    },
  };
  const SearchArray = [
    { orderType: SearchRgx }, { paymentMethod: SearchRgx }, { 'info.email': SearchRgx },
    { 'info.firstName': SearchRgx },
    { 'info.lastName': SearchRgx }, { 'info.phoneNo': SearchRgx },
    { 'address.city': SearchRgx },
  ];
  const Result = await ListTwoJoinService(
    req,
    Order,
    SearchArray,
    JoinStage1,
    JoinStage2,
  );
  res.status(200).json(Result);
};

module.exports = { placeOrder, findAllOrders, findOrderList };
