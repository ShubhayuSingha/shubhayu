const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://shubhayusingha:12345@shubhayu-cluster.55wzbvg.mongodb.net/?retryWrites=true&w=majority&appName=shubhayu-cluster');

const namesSchema = {
    name: String,
    time: {
        type: Date,
        default: function() {
            const now = new Date();
            // IST is UTC+5:30, so we add 5 hours and 30 minutes to the current UTC time
            const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
            return new Date(now.getTime()+istOffset);
            
        }
    },
    displayTime: {
        type: String,
        default: function() {
            const now = new Date();
            const formattedTime = `${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - ${now.toLocaleDateString('en-IN', { weekday: 'short' })} - ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;

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

    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    
    const now = new Date();
    
    const istTime = new Date(now.getTime() + istOffset);
    
    const formattedTime = `${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - ${now.toLocaleDateString('en-IN', { weekday: 'short' })} - ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;

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