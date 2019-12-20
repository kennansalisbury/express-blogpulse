var async = require('async')
var express = require('express')
var db = require('../models')
var router = express.Router()
var generalError = require('../loggers/generalError')

// POST /articles - create a new post
router.post('/', function(req, res) {
  let tags = []

  //if there are tags, split at commas and add to tags array
  if (req.body.tags) {
    tags = req.body.tags.split(',')
  }

  //create new article
  db.article.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then(article => {
    if (tags.length) {
    // Create new tags if tags array not empty
      async.forEach(tags, (t, done) => {
        db.tag.findOrCreate({
          where: { content: t.trim()}
        })
        .then(([tag, wasCreated]) => {
          //add to articles_tags tables
          article.addTag(tag)
          .then(() => {
            done()
          })
          .catch(done)//end of adding to join table
        })
        .catch(done)//end of finding or creating tag
      }, () => {
        //executes once when everything is done
        res.redirect('/articles/' + article.id)
      })
    } else {
      res.redirect('/articles/' + article.id)
    }  
  })
  .catch(function(error) {
    res.status(400).render('main/404')
  })
})

// GET /articles/new - display form for creating new articles
router.get('/new', function(req, res) {
  db.author.findAll()
  .then(function(authors) {
    res.render('articles/new', { authors: authors })
  })
  .catch(function(error) {
    res.status(400).render('main/404')
  })
})

// GET /articles/:id - display a specific post and its author
router.get('/:id', function(req, res) {
  db.article.findOne({
    where: { id: req.params.id },
    include: [db.author, db.comment, db.tag]
  })
  .then(function(article) {
    if (!article) throw Error()
    res.render('articles/show', { article })
  })
  .catch(function(error) {
    console.log(error)
    res.status(400).render('main/404')
  })
})

// POST /articles/:id/comments - add comments to database and display on show.ejs
router.post('/comments', (req, res) => {
  db.comment.create(req.body)
  .then(comment => {
    res.redirect('/articles/' + req.body.articleId)
  })
  .catch(generalError)
})

//GET articles/edit - display form to edit articles, pre-populate existing article information
router.get('/:id/edit', (req, res) => {
  db.article.findOne({
    where: { id: req.params.id },
    include: [db.author]
  })
  .then(article => {
    // res.send(article)
    res.render('articles/edit', {article})
  })
  .catch(generalError)
})

//POST articles/edit - post updated article information
router.post('/edit', (req, res) => {
  db.article.update({
    title: req.body.title,
    content: req.body.content
  }, {
    where: {
      id: req.body.id
    }
  }).then(article => {
    res.redirect('/articles/'+ req.body.id)
  })
  .catch(generalError)
})

// DELTE Comments
router.delete('/comments/:cid', (req, res) => {

  db.comment.destroy({
    where: {id: req.params.cid}
  })
  .then(comment => {
    res.redirect('/articles/' + req.body.articleId)
  })
  .catch(generalError)
})


module.exports = router
