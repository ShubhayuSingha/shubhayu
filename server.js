const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const moment = require('moment-timezone');

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://shubhayusingha:12345@shubhayu-cluster.55wzbvg.mongodb.net/?retryWrites=true&w=majority&appName=shubhayu-cluster');

const namesSchema = {
    name: String,
    time: {
        type: Date,
        default: function() {            
            return moment().toDate();
            
        }
    },
    displayTime: {
        type: String,
        default: function() {
            const istTime = moment.tz('Asia/Kolkata');
            return istTime.format('DD MMM YYYY - ddd - hh:mm:ss A')
        }
    }
}


const nameModel = mongoose.model('Names',namesSchema);

app.get('/peoplebefore', async(req,res) => {
    
    try{
        const names = await nameModel.find({}).sort({time: -1});
        res.render('peoplebefore',{
            namesList: names
        });
    } catch (err){
        res.status(500).send(err.message);
    }
});

app.get('/form',(req,res)=>{
    res.render('form');
});

app.post('/form',async(req,res)=>{
    const name = req.body.name;
    const istTime = moment.tz('Asia/Kolkata');   
    const formattedTime = istTime.format('DD MMM YYYY - ddd - hh:mm:ss A');  

    const newName = new nameModel({
        name: name,
        time: istTime,
        displayTime: formattedTime
    });


    try{
        await newName.save();
        res.redirect('/peoplebefore');
    } catch(err){
        res.status(500).send(err.message);
    }
});

app.use((req, res) => {
    res.status(404).send('<img src="/error404.jpg" alt="error" width="50%">');
});

app.listen(port, function() {
    console.log('server is running... at localhost3000');
});