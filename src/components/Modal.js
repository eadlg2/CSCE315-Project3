import Input from "./Input";
import Button from "./Button";
import { HeaderMedium, HeaderSmall } from "./typography/Header";
import { MdClose } from "react-icons/md";
import { useEffect, useState } from "react";
import TextArea from "./TextArea";
import Select from "./Select";
import MultiSelect from "./MultiSelect";

function Modal({ show, setShow, header, fields, buttonProps }) {
  const [ opacity, setOpacity ] = useState(0)

  useEffect(() => {
    if (show) {
      setOpacity(1)
    }
  }, [show, setOpacity])
  
  if (!show) {
    return null
  }

  function createInput(props) {
    return(
      <div className="modal-input">
        <HeaderSmall>{props.label}</HeaderSmall>

        <Input 
          value={props.value} 
          setValue={props.setValue}
          placeholder={`Enter ${props.label}`} 
        />
      </div>
    )
  }

  function createTextArea(props) {
    return(
      <div className="modal-textarea">
        <HeaderSmall>{props.label}</HeaderSmall>

        <TextArea
          value={props.value}
          setValue={props.setValue} 
          rows={5} 
          cols={35}
          placeholder={`Enter ${props.label}`}  
        />
      </div>
    )
  }

  function createSelect(props) {
    return(
      <div className="modal-select">
        <HeaderSmall>{props.label}</HeaderSmall>

        <Select
          value={props.value}
          setValue={props.setValue} 
          options={props.options}
          placeholder={`Select ${props.label}`}  
        />
      </div>
    )
  }

  function createMultiSelect(props) {
    return(
      <div className="modal-multiselect">
        <HeaderSmall>{props.label}</HeaderSmall>

        <MultiSelect
          value={props.value}
          setValue={props.setValue} 
          options={props.options}
          placeholder={`Select ${props.label}`}  
        />
      </div>
    )
  }

  function createFields() {
    if (fields) {
      return(
        <div className="modal-fields">
          {fields.map((item) => {
            if (item.type === 'input') {
              return createInput(item)
            } else if (item.type === 'textarea') {
              return createTextArea(item)
            } else if (item.type === 'select') {
              return createSelect(item)
            } else if (item.type === 'multiselect') { 
              return createMultiSelect(item)
            } else {
              return null
            }
          })}
        </div>
      )
    }
  }

  function createButton() {
    if (buttonProps) {
      return(
        <Button 
          size="md"
          fullWidth
          isLoading={buttonProps.isLoading}
          onClick={() => buttonProps.handleClick()}
        >
          {header}
        </Button>
      )
    }
  }

  return(
    <div className="modal" style={{ opacity: opacity }}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-header-text">
            <HeaderMedium>{header}</HeaderMedium>
          </div>

          <Button 
            size={'sm'}
            type={'icon'}
            onClick={() => {
              setOpacity(0)
              setTimeout(() => setShow(false), 150)
            }}
          >
            <MdClose size={25} />
          </Button>
        </div>

        {createFields()}

        {createButton()}
      </div>
    </div>
  )
}

export default Modal