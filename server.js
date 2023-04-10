const app = require('./bin/www');
const { getEnv } = require('./utils/dotenv.utils');
const connectDb = require('./db/connect');
const PORT = getEnv('PORT') || 3000;
const log = require('./log/index');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, async () => {
  await connectDb();
  log.info(`http://localhost:${PORT}`);
});
