import { useState, useRef, useEffect } from "react"
import { MdArrowDropDown } from "react-icons/md"

function MultiSelect({ value, setValue, options, placeholder }) {
  const [ display, setDisplay ] = useState("")

  const field = useRef(null)
  const optionsBox = useRef(null)

  useEffect(() => {
    if (value) {
      setDisplay(value.map((item, index, array) => {
        if (index === array.length - 1) {
          return item
        }

        return item + ", "
      }))
    } else {
      setDisplay("")
    }
  }, [value])

  function handleSelection(event) {
    if (event.target.checked) {
      setValue((state) => [ ...state, event.target.value ])
    } else {
      setValue(value.filter((item) => item !== event.target.value))
    }
  }

  function handleClick() {
    field.current.style.borderColor = 'var(--primary)'
    field.current.style.boxShadow = '0 0 0 1px var(--primary)'
    field.current.style.borderBottomLeftRadius = '0px'
    field.current.style.borderBottomRightRadius = '0px'

    optionsBox.current.style.display = 'block'
  }

  function handleBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      field.current.style.borderColor = 'var(--outline)'
      field.current.style.boxShadow = '0px 2px 3px 0.5px rgba(0, 0, 0, 0.05)'
      field.current.style.borderBottomLeftRadius = '8px'
      field.current.style.borderBottomRightRadius = '8px'

      optionsBox.current.style.display = 'none'
    }
  }

  return (
    <>
      <div className="multiselect" onBlur={(event) => handleBlur(event)}>
        <div 
          className="multiselect-field" 
          ref={field}
          tabIndex={0} 
          onClick={() => handleClick()}
        >
          <div className={display != "" ? "multiselect-display" : "multiselect-placeholder"}>
            {display != "" ? display : placeholder}
          </div>

          <MdArrowDropDown style={{ minWidth: '25px', height: '25px' }} />
        </div>

        <div className="multiselect-options" ref={optionsBox}>
          {options.map((option) => 
            <li className="multiselect-checkbox">
              <input 
                type='checkbox' 
                id={option} 
                defaultChecked={value.indexOf(option) === -1 ? false : true} 
                value={option} 
                onClick={(event) => handleSelection(event)}
              />
              <label htmlFor={option}>{option}</label>
            </li>
          )}
        </div>
      </div>
    </>
  )
}

export default MultiSelect