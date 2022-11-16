function TextArea({ value, setValue, rows, cols, placeholder }) {
  function handleChange(e) {
    setValue(e.target.value)
  }

  return (
    <textarea
      className="textarea"
      rows={rows}
      cols={cols}
      value={value}
      onChange={(e) => handleChange(e)}
      placeholder={placeholder}
      style={{ resize: 'none' }}
    />
  )
}

export default TextArea