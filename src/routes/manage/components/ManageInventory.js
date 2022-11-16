import { HeaderMedium } from "../../../components/typography/Header";
import axios from 'axios'
import { TABLE_THEME, SERVER_URL } from '../../../constants'
import { useTheme } from '@table-library/react-table-library/theme'
import { DEFAULT_OPTIONS, getTheme } from '@table-library/react-table-library/material-ui'
import { useEffect, useState } from "react";
import { usePagination } from '@table-library/react-table-library/pagination';
import Button from "../../../components/Button";
import ManageTable from "./ManageTable";
import { FaPen, FaPlus } from "react-icons/fa";
import Modal from "../../../components/Modal";

function ManageInventory() {
  const [ isLoading, setIsLoading ] = useState(false)
  const [ showAdd, setShowAdd ] = useState(false);
  const [ showUpdate, setShowUpdate ] = useState(false);

  const [ currId, setCurrId ] = useState("")
  const [ nameInput, setNameInput ] = useState("")
  const [ amountInput, setAmountInput ] = useState("")
  const [ storageInput, setStorageInput ] = useState("")

  const [ storedData, setStoredData ] = useState({ nodes: [] })
  const [ displayedData, setDisplayedData ] = useState({ nodes: [] })

  useEffect(() => {
    renderTable()
  }, [])

  const fields = [
    {
      label: 'Name',
      type: 'input',
      value: nameInput,
      setValue: setNameInput,
    },
    {
      label: 'Amount',
      type: 'input',
      value: amountInput,
      setValue: setAmountInput,
    },
    {
      label: 'Storage Location',
      type: 'select',
      value: storageInput,
      setValue: setStorageInput,
      options: [ 'Cold', 'Warm' ]
    },
  ]

  const addButtonProps = {
    isLoading: isLoading,
    handleClick: () => addToInventory(),
  }

  const updateButtonProps = {
    isLoading: isLoading,
    handleClick: () => updateInventory(),
  }

  const columns = [
    {label: 'Name', renderCell: (item) => item.item_name},
    {label: 'Amount', renderCell: (item) => item.item_amount},
    {
      label: 'Storage Location',
      renderCell: (item) => (
        item.storage_location.charAt(0).toUpperCase() + item.storage_location.slice(1)
      )
    },
    {
      label: 
        <Button 
          size={'sm'}
          type={'icon'}
          onClick={() => {
            setNameInput("")
            setAmountInput("")
            setStorageInput("")
            setShowAdd(true)
          }}
        >
          <FaPlus size={15} />
        </Button>,
      renderCell: (item) => {
        return(
          <Button
            size={'sm'}
            type={'icon'}
            onClick={() => {
              setCurrId(item.id)
              setNameInput(item.item_name)
              setAmountInput(item.item_amount)
              setStorageInput(item.storage_location.charAt(0).toUpperCase() + item.storage_location.slice(1))
              setShowUpdate(true)
            }}
          >
            <FaPen size={15} />
          </Button>
        )
      }
    },
  ]

  const materialTheme = getTheme(DEFAULT_OPTIONS)
  const COLUMN_THEME = {
    Table: `
      --data-table-library_grid-template-columns: 50% auto auto 5%;
    `,
  }
  const theme = useTheme([materialTheme, TABLE_THEME, COLUMN_THEME])

  const pagination = usePagination(displayedData, {
    state: {
      page: 0,
      size: 5,
    },
  })

  async function renderTable() {
    let ingredientsRes = await axios.get(`${SERVER_URL}/ingredients`)

    if (ingredientsRes) {
      setDisplayedData({ nodes: ingredientsRes.data })
      setStoredData({ nodes: ingredientsRes.data })
    }
  }

  async function addToInventory() {
    setIsLoading(true)

    if (nameInput && amountInput && storageInput) {
      await axios.post(`${SERVER_URL}/ingredients`, {
        item_name: nameInput,
        item_amount: parseInt(amountInput, 10),
        storage_location: storageInput
      })

      renderTable()
    }

    setIsLoading(false)
    setShowAdd(false)
  }

  async function updateInventory() {
    setIsLoading(true)

    await axios.put(`${SERVER_URL}/ingredients`, {
      id: currId,
      item_name: nameInput,
      item_amount: parseInt(amountInput, 10),
      storage_location: storageInput
    })

    setCurrId("")

    renderTable()

    setIsLoading(false)
    setShowUpdate(false)
  }

  return(
    <>
      <HeaderMedium>Inventory</HeaderMedium>

      <ManageTable 
        searchProps={{
          name: "Ingredients",
          property: "item_name",
          data: storedData,
          setData: setDisplayedData,
        }}
        columns={columns}
        displayedData={displayedData}
        theme={theme}
        pagination={pagination}
      />

      <Modal 
        show={showAdd} 
        setShow={setShowAdd}
        header={'Add Ingredient'} 
        fields={fields} 
        buttonProps={addButtonProps}
      />

      <Modal 
        show={showUpdate} 
        setShow={setShowUpdate}
        header={'Update Ingredient'} 
        fields={fields} 
        buttonProps={updateButtonProps}
      />
    </>
  )
}

export default ManageInventory