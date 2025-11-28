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
    const [budget, setBudget]=useState([])
    const [editing, setEditing]=useState()
    const [editItemVal, setEditItemVal] = useState('')
    const [editAmountVal, setEditAmountVal] = useState('')
    const [editCategoryVal, setEditCategoryVal] = useState('')
    

    const incomeTotal = budget.filter((i)=>i.type==="Income").reduce((total,item)=>total + Number(item.amount),0)
    const expenseTotal = budget.filter((i)=>i.type==="Expense").reduce((total,item)=>total + Number(item.amount),0)

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

    const fetchItems = async ( collectionName) => {
      try {
        const data = await getItems(collectionName);
        if(Array.isArray(data)){
          setBudget(data)
        }else{
          console.warn("Warning: getItems did not return an array. Data:", data);
          setBudget([]); 
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }

    useEffect(() => {
      if (selected === "budget") {
        fetchCategories('budget_categories');
        fetchItems('monthly_budget');
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

      try{
        const payload = {
          item: newItem,
          amount: amount,
          type: selectedType,
          category:selectedCategory
        }
        await createNewItem('monthly_budget', payload);
        setNewItem("")
        setAmount('')
        setSelectedCategory('')
        setSelectedType('')
        fetchItems('monthly_budget')
      }catch(error){
        console.error('Could not save: ', error)
        alert("Failed to sve Data")
      }
    }

    const editMode = (item)=>{
      console.log('Editing: ',item.id)
      setEditing(item.id)
      setEditItemVal(item.item)
      setEditAmountVal(item.amount)
      setEditCategoryVal(item.category)
    }

    const saveEdit = async (id) => {
      try {
        const payload = {
          item: editItemVal,
          amount: editAmountVal,
          category: editCategoryVal
        }
        await updateExistingItem('monthly_budget', id, payload)
        setEditing('')
        fetchItems('monthly_budget')
      } catch (error) {
        console.error("Failed to save edit:", error)
        alert("Failed to save changes")
      }
    }


    const cancelEdit = ()=>{
      setEditing('')
    }

    const deleteItem = async (id)=>{
       //console.log('Item ID: ', id)
      try{
        await deleteExistingItem('monthly_budget',id);
        fetchItems('monthly_budget');
      }catch(error){
        console.error('Failed to Delete Item, ', error)
        alert("Error Deleteing Item Check Console")
      }
    }

  return (
    <div className={selected === "budget" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
      <div className='budget_desktop_container'>
        <div className='budget_desktop_add'>
          <Input labelText={'Add Item'} type={'text'} id={'add_item'} value={newItem} change={(e)=>setNewItem(e.target.value)}/>
          <Input labelText={'Amount'} type={'number'} id={'amount'} value={amount} change={(e)=>setAmount(e.target.value)}/>
          <Dropdown Items={transType} label={'Transaction Type'} value={selectedType} change={(e) => setSelectedType(e.target.value)}/>
          <Dropdown label={'Category'} Items={categories} catID={'category'} value={selectedCategory} change={(e) => setSelectedCategory(e.target.value)}/>
          <Button text={'Add Item'} button_type={'primary'} func={addButton}/>
        </div>

        <div className='budget_desktop_display'>
          <h4 className='monthly_budget_title'>Income</h4>
          <div className='budget_table_container'>
            <table className='standard-table monthly_budget_table'>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {budget.filter((i) => i.type === "Income").map((item) => (
                  <tr key={item.id}>
                    {editing === item.id ? (
                      <>
                        <td><input type="text" value={editItemVal} onChange={(e)=>setEditItemVal(e.target.value)}/></td>
                        <td><input type="number" value={editAmountVal} onChange={(e)=>setEditAmountVal(e.target.value)}/></td>
                        <td>
                          <select value={editCategoryVal} onChange={(e)=>setEditCategoryVal(e.target.value)}>
                            {categories.map((cat, index) => (
                              <option key={index} value={cat.category}>{cat.category}</option>
                            ))}
                          </select>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{item.item}</td>
                        <td>$ {item.amount}</td>
                        <td>{item.category}</td>
                      </>
                    )}
                    <td>
                      <button 
                        className={`cat_button ${editing === item.id ? "cat_desktop_selected_off" : "cat_desktop_selected_on"}`} 
                        onClick={(e)=>editMode(item)}>
                          <img src='./pencil.png'/>
                      </button>
                      <button
                        className={`cat_button ${editing === item.id ? "cat_desktop_selected_off" : "cat_desktop_selected_on"}`} 
                        onClick={(e)=>deleteItem(item.id)}>
                          <img src='./delete.png'/>
                      </button>
                      <button 
                        className={`cat_button ${editing === item.id ? "cat_desktop_selected_on" : "cat_desktop_selected_off"}`}
                        onClick={(e)=>saveEdit(item.id)}>
                          <img src='./save.png'/>
                      </button>
                      <button 
                        className={`cat_button ${editing === item.id ? "cat_desktop_selected_on" : "cat_desktop_selected_off"}`} 
                        onClick={()=>cancelEdit()}>
                          <img src='./cancel.png'/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className='monthly_budget_footer'>
                <tr>
                  <td><strong>Total:</strong></td>
                  <td><strong>$ {incomeTotal}</strong></td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <h4 className='monthly_budget_title'>Expense</h4>
          <div className='budget_table_container'>
            <table className='standard-table monthly_budget_table'>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {budget.filter((i) => i.type === "Expense").map((item) => (
                  <tr key={item.id}>
                    {editing === item.id ? (
                      <>
                        <td><input type="text" value={editItemVal} onChange={(e)=>setEditItemVal(e.target.value)}/></td>
                        <td><input type="number" value={editAmountVal} onChange={(e)=>setEditAmountVal(e.target.value)}/></td>
                        <td>
                          <select value={editCategoryVal} onChange={(e)=>setEditCategoryVal(e.target.value)}>
                            {categories.map((cat, index) => (
                              <option key={index} value={cat.category}>{cat.category}</option>
                            ))}
                          </select>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{item.item}</td>
                        <td>$ ({item.amount})</td>
                        <td>{item.category}</td>
                      </>
                    )}
                    <td>
                      <button 
                        className={`cat_button ${editing === item.id ? "cat_desktop_selected_off" : "cat_desktop_selected_on"}`} 
                        onClick={(e)=>editMode(item)}>
                          <img src='./pencil.png'/>
                      </button>
                      <button
                        className={`cat_button ${editing === item.id ? "cat_desktop_selected_off" : "cat_desktop_selected_on"}`} 
                        onClick={(e)=>deleteItem(item.id)}>
                          <img src='./delete.png'/>
                      </button>
                      <button 
                        className={`cat_button ${editing === item.id ? "cat_desktop_selected_on" : "cat_desktop_selected_off"}`}
                        onClick={(e)=>saveEdit(item.id)}>
                          <img src='./save.png'/>
                      </button>
                      <button 
                        className={`cat_button ${editing === item.id ? "cat_desktop_selected_on" : "cat_desktop_selected_off"}`} 
                        onClick={()=>cancelEdit()}>
                          <img src='./cancel.png'/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className='monthly_budget_footer'>
                <tr>
                  <td><strong>Total:</strong></td>
                  <td><strong>$ ({expenseTotal})</strong></td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className='budget_desktop_footer'>
            <h5><strong>Monthly Budget: $ {incomeTotal - expenseTotal}</strong></h5>
        </div>
      </div>
    </div>
  )
}

export default Budget_desktop