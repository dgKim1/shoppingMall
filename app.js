const express = require("express")
const mongoose =require("mongoose")
const bodyParser = require("body-parser")
const cors = require('cors')
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")
const indexRouter = require('./routes/index');
const app = express()

require("dotenv").config()
app.use(
  cors({
    origin: ["http://localhost:5173","https://shopping-mall-fe-bay.vercel.app/"],
    credentials: true,
  })
)
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()) 
const swaggerDocument = YAML.load("./openapi.yaml")
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use("/api",indexRouter);

const mongoURI = process.env.LOCAL_DB_ADDRESS
mongoose.connect(mongoURI)
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection fail", err));
app.listen(process.env.PORT || 5000, ()=>{
    console.log("server on")
})
