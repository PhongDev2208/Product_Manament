const express = require("express");
const dotenv = require("dotenv");
const routesClient = require("./routes/client/index.route");
const routesAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')

dotenv.config();

database.connect();

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

// flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End flash

app.locals.prefixAdmin = systemConfig.prefixAdmin;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//Routes Client
routesClient(app);
//Routes Admin
routesAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
