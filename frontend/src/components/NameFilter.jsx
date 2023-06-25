const NameFilter = ({ handleSearchChange, newSearch }) => {

  return (
    <div>
      <label>filter shown with</label>
      <input type="text" onChange={handleSearchChange} value={newSearch} />
    </div>
  )
}

export default NameFilter