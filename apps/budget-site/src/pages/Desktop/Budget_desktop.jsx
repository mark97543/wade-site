import React, {useState, useEffect} from 'react'
import {Input, Button, Dropdown} from '@wade/ui'
import { getItems, createNewItem, deleteExistingItem, updateExistingItem } from '@wade/auth'


const transType = ['Income', 'Expense']

function Budget_desktop({selected}) {
    const [categories,setCategories]=useState([])
    const [newItem, setNewItem] = useState('')
    const [amount, setAmount]=useState('')
    const [selectedType, setSelectedType] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    

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

    const addButton = async ()=>{
      if(!newItem){
        alert("All Entries Required")
        return
      }else if(!amount){
        alert('All Entries Required')
        return
      }else if(selectedCategory===""){
        alert('All Entries Required')
        return
      }else if(selectedType===""){
        alert('All Entries Required')
        return
      }



      setNewItem("")
      setAmount('')
      setSelectedCategory('')
      setSelectedType('')
    }

  return (
    <div className={selected === "budget" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        <div className='budget_desktop_add'>
          <Input labelText={'Add Item'} type={'text'} id={'add_item'} value={newItem} change={(e)=>setNewItem(e.target.value)}/>
          <Input labelText={'Amount'} type={'number'} id={'amount'} value={amount} change={(e)=>setAmount(e.target.value)}/>
          <Dropdown Items={transType} label={'Transaction Type'} value={selectedType} change={(e) => setSelectedType(e.target.value)}/>
          <Dropdown label={'Category'} Items={categories} catID={'category'} value={selectedCategory} change={(e) => setSelectedCategory(e.target.value)}/>
          <Button text={'Add Item'} button_type={'primary'} func={addButton}/>
        </div>
      
    </div>
  )
}

export default Budget_desktop