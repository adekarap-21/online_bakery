const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Signup = require('./models/signup')
const Custom = require('./models/customization');
const session = require('express-session')
const multer = require('multer');
const {storage} = require('./cloudinary');
const upload = multer({ storage });
const flash = require('connect-flash')
const sessionOptions = {secret:'thisisnotagoodsecret',resave:false,saveUninitialized:false}
app.use(session(sessionOptions));
app.use(flash());


mongoose.connect('mongodb://localhost:27017/Bakery', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));
app.use(session({secret:'notagoodsecret'}));

app.use(express.urlencoded({ extended: true }));

const flavours = ['blackforest', 'yellow butter', 'pound','red velvet','dutch', 'sponge','pineapple','genoise'];
const weights = [0.5,1,1.5,2,2.5,3];
const fillings = ['dark chocolate', 'dutch chocolate', 'vanilla','red velvet','blueberry', 'milk chocolate','pineapple'];
const icings = ['dark chocolate', 'mango', 'vanilla','red velvet','fondant', 'milk chocolate','butter cream'];
const price = Math.floor((Math.random() * 500) + 150);

const requireLogin = (req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    next();
}

app.use((req, res, next) => {
    res.locals.messages = req.flash('success');
    next();
})

app.get('/index',(req,res)=>{
    res.render('index');
})

app.get('/cakes',(req,res)=>{
    res.render('cakes');
})
app.get('/cookies',(req,res)=>{
    res.render('cookies');
})
app.get('/snacks',(req,res)=>{
    res.render('snacks');
})
app.get('/muffines&donut',(req,res)=>{
    res.render('muffines&donut');
})
app.get('/contacts',(req,res)=>{
    res.render('contact');
})


app.get('/signup',(req,res)=>{
    res.render('signup');
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/customization',(req,res)=>{
    res.render('customization',{flavours,weights,fillings,icings});
})

app.post('/login',async (req,res)=>{
    const {username,password} = req.body;
    /* const user = await Signup.findOne({username});
    const validPassword = await bcrypt.compare(password,user.password); */
    const foundUser = await Signup.findAndValidate(username,password);
    if(foundUser){
        req.session.user_id = foundUser._id;
        req.flash('success', 'Successfully Logged in');
        res.redirect('/index')
    }
    else{
        res.redirect('/login')
    }
})

app.post('/signup',async(req,res)=>{
    const {password,username} = req.body;
    const user = new Signup({
        username,
        password
    });
    await user.save();
    req.session.user_id = user._id;
    req.flash('success', 'Successfully registered');
    res.redirect('/index')
})

app.post('/custom',requireLogin,upload.array('image'),async(req,res)=>{
    const{name,email,address,phone,date,time,flavour,weight,filling,icing,image} = req.body;
    const custom = new Custom({name,email,address,phone,date,time,flavour,weight,filling,icing,image})
    const latest = await custom .save();
    res.redirect('/index');
})

app.listen(3500, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})