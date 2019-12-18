let db = require('./models')

// db.comment.create({
//     name: 'Ryan Salisbury',
//     content: 'This is another comment!',
//     articleId: 1
// })
// .then(comment => {
//     console.log(comment.get())
// })
// .catch(err => {
//     console.log('Error', err)
// })

db.article.findOne({
    where: {id : 1},
    include: [db.comment]
})
.then(article => {
    console.log(article)
    console.log(article.comments)
}) 