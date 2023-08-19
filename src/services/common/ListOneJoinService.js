const ListOneJoinService = async (
  Request,
  DataModel,
  SearchArray,
  JoinStage,
) => {
  try {
    const pageNo = Number(Request.params.pageNo);
    const perPage = Number(Request.params.perPage);
    const searchValue = Request.params.searchKeyword;
    const skipRow = (pageNo - 1) * perPage;
    let data;
    if (searchValue !== '0') {
      data = await DataModel.aggregate([
        JoinStage,
        { $match: { $or: SearchArray } },
        {
          $facet: {
            Total: [{ $count: 'count' }],
            Rows: [{ $skip: skipRow }, { $limit: perPage }],
          },
        },
      ]);
    } else {
      data = await DataModel.aggregate([
        JoinStage,
        {
          $facet: {
            Total: [{ $count: 'count' }],
            Rows: [{ $skip: skipRow }, { $limit: perPage }],
          },
        },
      ]);
    }
    return { status: 'success', data };
  } catch (error) {
    return { status: 'fail', data: error };
  }
};

module.exports = ListOneJoinService;
