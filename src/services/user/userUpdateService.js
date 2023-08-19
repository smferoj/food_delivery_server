const userUpdateService = async (req, dataModel) => {
  try {
    const { email } = req.headers.user;
    const { firstName, lastName, phoneNo,password } = req.body;
    const user = await dataModel.updateOne(
      { email: email },
      { firstName, lastName, phoneNo,password },
    );
    return { status: 'success', data: user };
  } catch (error) {
    return { status: 'fail', data: error.toString() };
  }
};

module.exports = userUpdateService;
