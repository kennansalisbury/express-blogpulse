var express = require('express')
var db = require('../models')
var router = express.Router()

// POST /articles - create a new post
router.post('/', function(req, res) {
  db.article.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then(function(post) {
    res.redirect('/')
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
    include: [db.author, db.comment]
  })
  .then(function(article) {
    if (!article) throw Error()
    // console.log(article)
    // res.send(article)
    res.render('articles/show', { article: article })
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
  .catch(err => {
    console.log(err)
    res.send('error')
})

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
})

module.exports = router
