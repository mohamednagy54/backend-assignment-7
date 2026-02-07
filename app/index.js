const express = require('express')
const { connectDB, sequelize } = require('./db')
const { userRouter, postRouter, commentRouter } = require('./modules')

const PORT = 3000
const app = express()

app.use(express.json())

connectDB()
sequelize.sync()

app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/comments', commentRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`)
})
