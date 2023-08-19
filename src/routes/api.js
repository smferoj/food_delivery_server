const express = require('express');
const ItemCategoryController = require('../controllers/MenuItem/ItemCategoryController');
const ItemController = require('../controllers/MenuItem/ItemController');
const adminController = require('../controllers/admin/adminController');
const {
  registration, getUserProfile,
  login, updateProfile, recoverVerifyEmail, recoverVerifyOTP,
  resetPassword, addLocation, getLocations, deleteLocation,
} = require('../controllers/customer/customersController');
const authVerifyMiddleware = require('../middlewares/common/authVerifyModdleware');
const {
  addCustomerValidator,
  addCustomerValidationHandler,
} = require('../middlewares/customer/customerValidator');
const { placeOrder, findAllOrders, findOrderList } = require('../controllers/order/orderController');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.get('/status', ItemController.status); // Checking Status

// customer API
router.post('/registration', addCustomerValidator, addCustomerValidationHandler, registration);
router.get('/profile', authVerifyMiddleware, getUserProfile);
router.post('/login', login);
router.post('/updateProfile', authVerifyMiddleware, updateProfile);
router.get('/recoverVerifyEmail/:email', recoverVerifyEmail);
router.get('/recoverVerifyOTP/:email/:otp', recoverVerifyOTP);
router.post('/resetPassword', resetPassword);
router.post('/addLocation', authVerifyMiddleware, addLocation);
router.get('/getLocations', authVerifyMiddleware, getLocations);
router.get('/deleteLocation/:id', deleteLocation);

// Item Category
router.post('/CreateItemCategory', ItemCategoryController.CreateItemCategory);
router.get('/GetMenuItemById/:id', ItemController.GetMenuItemById);
router.post('/UpdateItemCategory/:id', ItemCategoryController.UpdateItemCategory);
router.get('/ItemCategoryList/:pageNo/:perPage/:searchKeyword', ItemCategoryController.ItemCategoryList);
router.get('/CategoryTypesDropDown', ItemCategoryController.CategoryTypesDropDown);
router.get('/categoryWiseNumOfMenuItem', ItemCategoryController.categoryWiseNumOfMenuItem);
router.get('/deleteCategory/:id', ItemCategoryController.deleteCategory);
// router.get('/MenuItemTypesDetailsByID/:id', ItemCategoryController.MenuItemTypesDetailsByID);

// Menu Item
router.post('/CreateItem', ItemController.CreateItem);
router.post('/UpdateItem/:id', ItemController.UpdateItem);
router.get('/ItemList/:pageNo/:perPage/:searchKeyword', ItemController.ItemList);
router.get('/categoryWiseItems/:searchKeyword', ItemController.categoryWiseItems);
router.get('/deleteItem/:id', ItemController.deleteItem);
router.get('/GetMenuItemById/:id', ItemController.GetMenuItemById);
router.get('/GetItemDetailsById/:id', ItemController.GetItemDetailsById);

// Admin
router.post('/registration/admin', adminController.Registration);
router.post('/login/admin', adminController.Login);
router.post('/updateProfile/admin', authVerifyMiddleware, adminController.updateProfile);
router.get('/profile/admin', authVerifyMiddleware, adminController.getAdminProfile);
router.get('/recoverVerifyEmail/admin/:email', adminController.recoverVerifyEmail);
router.get('/recoverVerifyOTP/admin/:email/:otp', adminController.recoverVerifyOTP);
router.post('/resetPassword/admin', adminController.resetPassword);
router.get('/getUsers/:pageNo/:perPage/:searchKeyword', authVerifyMiddleware, adminController.getUsers);

// order
router.post('/placeOrder', placeOrder);
router.get('/findAllOrders', findAllOrders);
router.get('/findOrderList/:pageNo/:perPage/:searchKeyword', findOrderList);

module.exports = router;
