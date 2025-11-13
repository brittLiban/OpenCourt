const express = require('express')
const router =  require("./routers/router")

const app = express()
const port = 3000

app.use(express.json());
app.use("/api", router)

if (process.env.RUN_MODE !== 'test') {
  app.listen(port, () => {
    console.log(`Open Court API listening on port ${port}`)
  })
}

module.exports = app;
