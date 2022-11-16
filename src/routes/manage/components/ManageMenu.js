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

function ManageMenu() {
  const [ isLoading, setIsLoading ] = useState(false)
  const [ showAdd, setShowAdd ] = useState(false);
  const [ showUpdate, setShowUpdate ] = useState(false);

  const [ currId, setCurrId ] = useState("")
  const [ nameInput, setNameInput ] = useState("")
  const [ categoryInput, setCategoryInput ] = useState("")
  const [ ingredientsInput, setIngredientsInput ] = useState([])
  const [ priceInput, setPriceInput ] = useState("")
  const [ descriptionInput, setDescriptionInput ] = useState("")

  const [ storedData, setStoredData ] = useState({ nodes: [] })
  const [ displayedData, setDisplayedData ] = useState({ nodes: [] })

  const [ ingredientsData, setIngredientsData ] = useState([])

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
      label: 'Category',
      type: 'input',
      value: categoryInput,
      setValue: setCategoryInput,
    },
    {
      label: 'Ingredients',
      type: 'multiselect',
      value: ingredientsInput,
      setValue: setIngredientsInput,
      options: ingredientsData.map((item) => item.item_name)
    },
    {
      label: 'Price',
      type: 'input',
      value: priceInput,
      setValue: setPriceInput,
    },
    {
      label: 'Description',
      type: 'textarea',
      value: descriptionInput,
      setValue: setDescriptionInput,
    },
  ]

  const addButtonProps = {
    isLoading: isLoading,
    handleClick: () => addToMenu(),
  }

  const updateButtonProps = {
    isLoading: isLoading,
    handleClick: () => updateMenu(),
  }

  function idToName(ingredients_inventory_id) {
    if (ingredientsData) {
      return ingredients_inventory_id.map((id) => {
        let name = ""
  
        for (let i = 0; i < Object.keys(ingredientsData).length; ++i) {
          if (id === ingredientsData.at(i).id) {
            name = ingredientsData.at(i).item_name
          }
        }
  
        return name
      })
    }
  }

  function nameToId(names) {
    if (ingredientsData) {
      return names.map((name) => {
        let id = ""
  
        for (let i = 0; i < Object.keys(ingredientsData).length; ++i) {
          if (name === ingredientsData.at(i).item_name) {
            id = ingredientsData.at(i).id
          }
        }
  
        return id
      })
    }
  }

  const columns = [
    {label: 'Name', renderCell: (item) => item.name},
    {label: 'Category', renderCell: (item) => item.category},
    {label: 'Ingredients', renderCell: (item) => {
        let names = idToName(item.ingredients_inventory_id)

        return names.map((name, index, array) => {
          if (index === array.length - 1) {
            return name
          }

          return name + ", "
        })
      }
    },
    {label: "Price", renderCell: (item) => item.price},
    {label: "Description", renderCell: (item) => item.description},
    {
      label: 
        <Button 
          size={'sm'}
          type={'icon'}
          onClick={() => {
            setNameInput("")
            setCategoryInput("")
            setIngredientsInput("")
            setPriceInput("")
            setDescriptionInput("")
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
              setNameInput(item.name)
              setCategoryInput(item.category)
              setIngredientsInput(idToName(item.ingredients_inventory_id))
              setPriceInput(item.price)
              setDescriptionInput(item.description)
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
      --data-table-library_grid-template-columns: 15% 10% 35% 8% 27% 5%;
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
    let menuRes = await axios.get(`${SERVER_URL}/menu`)
    let ingredientsRes = await axios.get(`${SERVER_URL}/ingredients`)

    if (menuRes) {
      setDisplayedData({ nodes: menuRes.data })
      setStoredData({ nodes: menuRes.data })
    }

    if (ingredientsRes) {
      setIngredientsData(ingredientsRes.data)
    }
  }

  async function addToMenu() {
    setIsLoading(true)

    if (nameInput && categoryInput && ingredientsInput && priceInput && descriptionInput) {
      await axios.post(`${SERVER_URL}/menu`, {
        name: nameInput,
        category: categoryInput,
        ingredients_inventory_id: nameToId(ingredientsInput),
        price: parseFloat(priceInput),
        description: descriptionInput,
      })

      renderTable()
    }

    setIsLoading(false)
    setShowAdd(false)
  }

  async function updateMenu() {
    setIsLoading(true)

    await axios.put(`${SERVER_URL}/menu`, {
      id: currId,
      name: nameInput,
      category: categoryInput,
      ingredients_inventory_id: nameToId(ingredientsInput),
      price: parseFloat(priceInput),
      description: descriptionInput,
    })

    setCurrId("")

    renderTable()

    setIsLoading(false)
    setShowUpdate(false)
  }

  return(
    <>
      <HeaderMedium>Menu</HeaderMedium>

      <ManageTable 
        searchProps={{
          name: "Menu Items",
          property: "name",
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
        header={'Add Menu Item'} 
        fields={fields} 
        buttonProps={addButtonProps}
      />

      <Modal 
        show={showUpdate} 
        setShow={setShowUpdate}
        header={'Update Menu Item'} 
        fields={fields} 
        buttonProps={updateButtonProps}
      />
    </>
  )
}

export default ManageMenu