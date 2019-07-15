module.exports = {
  wrapJSON(data) {
    return {
      status: true,
      data: {
        ...data
      }
    };
  }
};