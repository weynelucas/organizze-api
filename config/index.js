module.exports = {
  port: process.env.PORT || 3100,
  rounds: process.env.SALT_ROUNDS || 10,
  secret: process.env.SECRET_KEY || 'secret',
  tokenLifetime: process.env.TOKEN_LIFETIME || '5h'
};