/* eslint-env node */
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const config = require('./utils/config')
const logger = require('./utils/logger')

// const baseUrl = ''
// const baseUrl = 'http://localhost:3001/'

const cors = require('cors')
// const person = require('./models/person')


app.use(cors())
app.use(express.json())

// let persons = [
//   {
//     "id": 1,
//     "name": "Arto Hellas",
//     "number": "040-123456"
//   },
//   {
//     "id": 2,
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523"
//   },
//   {
//     "id": 3,
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": 4,
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })

})

// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })

app.get('/api/persons/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      response.send(`<h3>Phonebook has info for ${count} people</h3>`)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'Cannot fetch items count data' })
    }
    )
})

// response.send(`<p>Phonebook has info for ${Person.length} people</p> <p>${new Date()}<p>`)

// app.get('/info', (request, response) => {
//   response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}<p>`)
// })

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformated id' })
    })
})

// app.get('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const person = persons.find(person => person.id === id)

//   if (person) {
//     response.json(person)
//   } else {
//     response.status(404).end()
//   }
// })

app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log('Contact successfully deleted:', result)
      response.status(204).end()
    })
    .catch(error => {
      console.log('Error deleting contact:', error)
      next(error)
    })

})

// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   persons = persons.filter(note => note.id !== id)
//   response.status(204).end()
// })

// const generatedId = () => {
//   return Math.floor(Math.random() * 1000000)
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body


  // if (body.name === undefined || body.number === undefined) {
  //   return response.status(400).json({ error: 'name or number is missing' })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  // const body = request.body
  const { name, number } = request.body

  // const person = {
  //   name: body.name,
  //   number: body.number,
  // }
  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// app.post('/api/persons', (request, response) => {
//   const body = request.body
//   if (!body.name || !body.number) {
//     return response.status(400).json({
//       error: 'name or number is missing'
//     })
//   }

//   if (persons.find(person => person.name === body.name)) {
//     return response.status(400).json({
//       error: 'name must be unique'
//     })
//   }

//   const person = {
//     name: body.name,
//     number: body.number,
//     id: generatedId(),
//   }
//   persons = persons.concat(person)
//   response.json(person)
// })



const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`)
})

// const PORT = process.env.PORT
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`)
// })
