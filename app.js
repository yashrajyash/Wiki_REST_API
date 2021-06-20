const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

app.set('view engine', 'ejs');



mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please give title to your post"]
    },
    content: {
        type: String,
        required: [true, "Please give content to your title"]
    }
});


const Article = mongoose.model('Article', articleSchema);


///////////////////////////////////Request targeting all the articles//////////////////////////////

app.route('/articles')


    .get(function(req, res) {
        Article.find({}, function(err, foundArticles) {
            if(!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })


    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err) {
            if(!err) {
                res.send('Successfully added a new article.');
            } else {
                res.send(err);
            }
        });
    })


    .delete(function(req, res) {
        Article.deleteMany({}, function(err) {
            if(!err) {
                res.send('Successfully deleted all the items');
            } else {
                res.send(err);
            }
        });
    });

///////////////////////////////////Request targeting a specific articles//////////////////////////////

app.route('/articles/:articleTitle')

    .get(function(req, res) {
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
            if(foundArticle) {
                res.send(foundArticle);
            } else {
                res.send('No article matching that was found');
            }
        });
    })

    .put(function(req, res) {
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err) {
                if(!err) {
                    res.send('Successfully updated article.');
                }
            }
        );
    })

    .patch(function(req, res) {
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err) {
                if(!err) {
                    res.send('Successfully updated article.');
                } else {
                    res.send(err);
                }
            }
        );
    })

    .delete(function(req, res) {
        Article.deleteOne({title: req.params.articleTitle}, function(err) {
            if(!err) {
                res.send('Successfully deleted the article.');
            } else {
                res.send(err);
            }
        });
    });


app.listen(port, function(){
    console.log('Server has started at: http://localhost:'+port);
});
