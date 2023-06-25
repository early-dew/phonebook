
const People = ({ person, newSearch, deleteContact }) => {
  const filteredSearch = person.name.toLowerCase().includes(newSearch.toLowerCase())


  return (
    <>
      {filteredSearch && (
        <div style={{ paddingBottom: "8px" }}>
          <span>{person.name} {person.number}</span> <button onClick={deleteContact}>delete</button>
        </div>
      )}
    </>
  )
}

export default People