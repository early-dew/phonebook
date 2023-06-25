import { useState, useEffect } from 'react'
import People from './components/People'
import NewPeopleForm from './components/NewPeopleForm'
import NameFilter from './components/NameFilter'
import phonebookService from './services/peoples'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const SuccessNotification = ({ message }) => {
    if (message === null) {
      return null
    }
    return (
      <div className='successful'>{message}</div>
    )
  }

  const ErrorNotification = ({ message }) => {
    if (message === null) {
      return null
    }
    return (
      <div className='failed'>{message}</div>
    )
  }

  useEffect(() => {
    phonebookService
      .getAll()
      .then(allPeople => {
        setPersons(allPeople)
      })
      .catch(error => {
        console.log("failed to show all phone contacts")
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }


  const addNumber = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    const sameName = persons.find(person => person.name.toLowerCase() === nameObject.name.toLowerCase())

    if (sameName && nameObject.number !== '') {
      let result = window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)
      if (result === true) {
        const updatedPerson = { ...sameName, number: nameObject.number }
        phonebookService
          .update(sameName.id, updatedPerson)
          .then(returnedData => {
            setPersons(persons.map(person => person.id !== sameName.id ? person : returnedData))
          })
      }
    } else if (sameName) {
      alert(`${newName} is already added to phonebook`)
    } else {
      phonebookService
        .create(nameObject)
        .then(addedPerson => {
          setPersons(persons.concat(addedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Added ${newName}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 2000)
        })
        .catch(error => {
          console.log("failed to create a new contact")
        })
    }

  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const deleteContact = (id, name) => {

    let result = confirm(`Delete ${name}?`)
    if (result === true) {
      phonebookService
        .remove(id)
        .then(returnedData => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.log('Failed to delete contact:', error)
          setErrorMessage(`Information of ${name} has already been removed from the server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 6000)
        })
    }

  }



  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <NameFilter handleSearchChange={handleSearchChange} newSearch={newSearch} />
      <h3>Add a new</h3>
      <NewPeopleForm
        handleNameChange={handleNameChange}
        newName={newName}
        handleNumberChange={handleNumberChange}
        newNumber={newNumber}
        addNumber={addNumber}
      />
      <h3>Numbers</h3>
      <div>
        {persons.map(person =>
          <People key={person.id} person={person} name={person.name} newSearch={newSearch} deleteContact={() => deleteContact(person.id, person.name)} />
        )}
      </div>
    </div>
  )
}

export default App

