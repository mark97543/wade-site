import React, {useState, useEffect} from 'react'
import {Input, Button, Dropdown} from '@wade/ui'
import { getItems, createNewItem, deleteExistingItem, updateExistingItem } from '@wade/auth'


const transType = ['Income', 'Expense']

function Budget_desktop({selected}) {
    const [categories,setCategories]=useState([])

    const fetchCategories = async (collectionName) => {
      try {
        const data = await getItems(collectionName);
        if (Array.isArray(data)) {
          setCategories(data) 
        } else {
          console.warn("Warning: getItems did not return an array. Data:", data);
          setCategories([]); 
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    useEffect(() => {
      if (selected === "budget") {
        fetchCategories('budget_categories');
      }
    }, [selected]);

    console.log(categories)

  return (
    <div className={selected === "budget" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        <div className='budget_desktop_add'>
          <Input labelText={'Add Item'} type={'text'}/>
          <Input labelText={'Amount'} type={'text'}/>
          <Dropdown Items={transType} label={'Transaction Type'}/>
          <Dropdown label={'Category'} Items={categories} catID={'category'}/>
          <Button text={'Add Item'} button_type={'primary'}/>
        </div>
      
    </div>
  )
}

export default Budget_desktop