const mongoose = require('mongoose');
const DataModel = require('../../models/MenuItem/ItemCategoryModel');
const ItemModel = require('../../models/MenuItem/ItemModel');
const CreateService = require('../../services/common/CreateService');
const UpdateService = require('../../services/common/UpdateService');
const DropDownService = require('../../services/common/DropDownService');
const DeleteService = require('../../services/common/DeleteService');
// const DetailsByIDService = require('../../services/common/DetailsByIDService');
const CheckAssociateService = require('../../services/common/CheckAssociateService');
const ListService = require('../../services/common/ListService');

const { ObjectId } = mongoose.Types;

exports.CreateItemCategory = async (req, res) => {
  const Result = await CreateService(req, DataModel);
  res.status(200).json(Result);
};

exports.UpdateItemCategory = async (req, res) => {
  const Result = await UpdateService(req, DataModel);
  res.status(200).json(Result);
};

exports.ItemCategoryList = async (req, res) => {
  const SearchRgx = { $regex: req.params.searchKeyword, $options: 'i' };
  const SearchArray = [{ ItemCategory: SearchRgx }];
  const Result = await ListService(req, DataModel, SearchArray);
  res.status(200).json(Result);
};

exports.CategoryTypesDropDown = async (req, res) => {
  const Result = await DropDownService(req, DataModel, { _id: 1, ItemCategory: 1 });
  res.status(200).json(Result);
};

exports.categoryWiseNumOfMenuItem = async (req, res) => {
  try {
    const Result = await DataModel.aggregate([
      {
        $lookup: {
          from: 'items',
          localField: '_id',
          foreignField: 'CategoryId',
          as: 'items',
        },
      },
      {
        $project: {
          category: '$CategoryName', // Replace 'CategoryName' with the actual field name for the category in the "DataModel" collection.
          ItemImage: 1,
          ItemCategory: 1,
          numberOfMenuItems: { $size: '$items' },
        },
      },
      {
        $match: {
          numberOfMenuItems: { $gt: 0 }, // Filter out categories with no menu items
        },
      },
    ]);

    res.status(200).json({ status: 'success', data: Result });
  } catch (error) {
    res.status(200).json({ status: 'fail', data: error });
  }
};

exports.deleteCategory = async (req, res) => {
  const DeleteID = req.params.id;
  const CheckAssociate = await CheckAssociateService({ CategoryId: ObjectId(DeleteID) }, ItemModel);

  if (CheckAssociate) {
    res.status(200).json({ status: 'associate', data: 'Associate with Expenses' });
  } else {
    const Result = await DeleteService(req, DataModel);
    res.status(200).json(Result);
  }
};
