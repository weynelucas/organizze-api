module.exports = {
  port: process.env.PORT || 3100,
  secret: process.env.SECRET_KEY || 'secret',
  rounds: process.env.SALT_ROUNDS || 10
};