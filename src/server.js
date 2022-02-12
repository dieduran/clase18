import dotenv from 'dotenv';
import express from 'express'

import handlebars from 'express-handlebars'
import path from 'path'
/** para manejo de sesion */
import session from 'express-session'
/** passport  */
import passport  from 'passport'
import bcrypt from 'bcrypt'
import {Strategy as LocalStrategy} from 'passport-local';

import {conectarDB} from './options/conexionBD.js'
import {User} from '../models/modelUser.js'
import {routerProductos} from '../routes/routerProducto.js'
import {routerCarritos} from '../routes/routerCarrito.js'
import {getRegistro, getLoginError, getRegistroError, errorRuteo } from '../controllers/login.js'
import enviamosCorreo from './mail.js';
import logger from "../src/logger.js";

dotenv.config();

let usuario;
const app = express()

/*-----------------------------------------*/
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
 
passport.use('signup', new LocalStrategy({
    passReqToCallback: true
    },
    (req, username, password, done) => {
      User.findOne({ 'username': username }, function (err, user) {
    
        if (err) {
          //console.log('Error in SignUp: ' + err);
          logger.error("Error in SignUp: " + err);
          return done(err);
        }
    
        if (user) {
          //console.log('User already exists');
          logger.info('User already exists');
          return done(null, false)
        }
        const newUser = {
          username: req.body.username,
          password: createHash(password),
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          avatar: req.body.avatar
        }
        User.create(newUser, (err, userWithId) => {
            if (err) {
              //console.log('Error in Saving user: ' + err);
              logger.error('Error in Saving user: ' + err);
              return done(err);
            }
            //console.log('User Registration succesful');
            logger.info('User Registration succesful');
            let auxTextoCorreo = `<span>Nombre: ${newUser.name} <br> Username: ${newUser.username} <br> Direccion: ${newUser.address} <br>  Telefono: ${newUser.phone} <br>  </span>`
            enviamosCorreo("Nuevo registro", auxTextoCorreo)
            return done(null, userWithId);
          });
        });
  }))

passport.use('login', new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err)
        return done(err);
      if (!user) {
        //console.log('User Not Found with username ' + username);
        logger.info('User Not Found with username ' + username);
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        //console.log('Invalid Password');
        logger.error('Invalid Password');
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}
     
function createHash(password) {
  return bcrypt.hashSync( password, bcrypt.genSaltSync(10), null);
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});
   
app.use(
    session({
      secret: "coderhouse",
      cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 60*10*1000,
      },
      rolling: true,
      resave: true,
      saveUninitialized: false,
  })
);
/*-----------------------------------------*/
//**  Manejador de plantillas */
app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'default',
  layoutDir: "/views/layouts",
}))

app.set('view engine', 'hbs');
app.set('views', path.join(process.cwd(), 'public/views'));

//--------------------------------------------
// agrego middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/** Carpeta publica */
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());
    
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}


/** Routers */
app.use('/api/productos',routerProductos)
app.use('/api/carrito', checkAuthentication, routerCarritos)

/*------login */
app.get('/login', (req, res) => {
  if (req.isAuthenticated()) { 
    res.redirect("/");
  } else {
    res.sendFile("formLogin.html", { root: "./public" });
  }
});

app.post('/login', 
  passport.authenticate("login", {
    failureRedirect: "/faillogin",
    //successRedirect: "/", //antes iba a productos..ahora a carrito
    successRedirect: "/carrito",
  })
);

app.get("/signup", getRegistro);

app.post("/signup",
  passport.authenticate("signup", {
    failureRedirect: "/failsignup",
    successRedirect: "/login",
  })
);

app.get('/', (req, res) => {
  let auxName=""
  let auxAvatar=""
  if (req.user!=null) { 
      auxName=req.user.name 
      auxAvatar=req.user.avatar
  }
    res.render('index.hbs',{
      active: 'index',
      userName: auxName,
      userAvatar: auxAvatar
  })
})

app.get('/carrito', (req, res) => {
  let auxName=""
  let auxAvatar=""
  if (req.user!=null) { 
    auxName=req.user.name 
    auxAvatar=req.user.avatar
  }
  res.render('carrito.hbs',{
      active: 'carrito',
      userName: auxName,
      userAvatar: auxAvatar
  })
})

app.get("/failsignup", getRegistroError);

app.post("/login",        
  passport.authenticate("login", {
    failureRedirect: "/faillogin",
    successRedirect: "/",
  })
);

app.get("/faillogin", getLoginError);

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            usuario= "";
            res.sendFile('formLogout.html',{ root: './public' })
        } else {
            //console.log('logout error')
            logger.error('Logout ERROR ', err)
            res.send({ status: 'Logout ERROR', body: err })
        }
    })
})

conectarDB(
  //"//cadena de conexion a mongoAtlas",
  process.env.MONGO_DB_URI,
  (err) => {
    if (err) {
      //console.log("Error en conexión de base de datos", err);
      logger.error("Error en conexión de base de datos", err);
      return 
    }
    //console.log("Base de datos conectada...");
    logger.info("Base de datos conectada...");
  }
);

const cargarDatosSesion =async()=> {
    return {usuario}
}

//no entro por ninguna api valida: => mensaje de error
app.use(function(req, res) {
    res.json({
        error: -2,
        descripcion: `ruta '${req.url}' metodo '${req.method}'  no implementada.`,
    });    
});    

export default app;