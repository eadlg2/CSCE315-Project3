function Select({ value, setValue, options, placeholder }) {
  function handleChange(e) {
    setValue(e.target.value)
  }

  return (
    <select
      className="select"
      value={value}
      onChange={(e) => handleChange(e)}
      required
    >
      <option value="" disabled selected hidden>{placeholder}</option>
      {options.map((option) => 
        <option value={option}>{`${option}`}</option>
      )}
    </select>
  )
}

export default Select