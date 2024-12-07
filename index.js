import app from './app.js';

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`We're Listening on Port:${port}`);
});
