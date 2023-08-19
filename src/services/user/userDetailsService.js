const userDetailsService = async (req, dataModel) => {
  try {
    const { email } = req.headers.user;

    const user = await dataModel.aggregate([
      {
        $match: { email },
      },
    ]);

    return { status: 'success', data: user };
  } catch (error) {
    return { status: 'fail', data: error.toString() };
  }
};

module.exports = userDetailsService;
