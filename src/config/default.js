const config = {
  secret: 'top_top_secret',
  accessTokenLifetime: 15,
  db: {
    connectionString: 'mongodb+srv://dbUser:testpass@whos-next-cluster0-uh6mv.mongodb.net/test?retryWrites=true&w=majority'
  }
};

module.exports = config;