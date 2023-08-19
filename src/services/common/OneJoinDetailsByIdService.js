const OneJoinDetailsByIdService = async (
  Request,
  DataModel,
  JoinStage,
) => {
  try {
    const { id } = Request.params;
    const data = await DataModel.aggregate([
      JoinStage,
      { $match: { id } },
      {
        $facet: {
          Total: [{ $count: 'count' }],
          Rows: [],
        },
      },
    ]);

    return { status: 'success', data };
  } catch (error) {
    return { status: 'fail', data: error };
  }
};

module.exports = OneJoinDetailsByIdService;
