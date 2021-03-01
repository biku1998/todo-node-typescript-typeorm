import { app, initializeDatabase } from "./app";

const PORT = process.env.PORT;
app.listen(PORT, async function () {
  await initializeDatabase();
  console.log(`node server running at port : ${PORT}`);
});
