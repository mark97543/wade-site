import React, {useState, useEffect} from 'react'
import {Input, Button} from '@wade/ui'
import { getItems, createNewItem } from '@wade/auth'

function Cat_desktop({selected}) {
  // 1. Configuration: Make sure this matches your Directus Collection Name exactly
  const collectionName = 'budget_categories'; 

  // 2. State for the list and the inputs
  const [categories, setCategories] = useState([]);
  const [newItem, setNewItem] = useState('')
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)

  // 3. The Trigger: Fetch data when the component mounts
  useEffect(() => {
    if (selected === "cat") {
      fetchCategories();
    }
  }, [selected]); // Re-fetch if the tab is selected (optional optimization)

  const fetchCategories = async () => {
    try {
      const data = await getItems(collectionName);
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.warn("Warning: getItems did not return an array. Data:", data);
        setCategories([]); // Set to empty array to prevent UI errors
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setLoading(false);
    }
  }

  // 4. The Action: Send data to Directus
  const addItemButton = async () => {
    if(!newItem) return; // Prevent empty adds

    try {
      // Matches fields in Directus (e.g., 'name', 'note')
      const payload = {
        category: newItem,
        note: newNote
      };

      await createNewItem(collectionName, payload);
      
      // Clear inputs and refresh list
      setNewItem('');
      setNewNote('');
      fetchCategories(); 
    } catch (error) {
      console.error("Failed to create item:", error);
      alert("Error creating item. Check console/permissions.");
    }
  }

  return (
    <div className={selected === "cat" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        <div className='cat_desktop_wrapper'>

          {/* Input Section */}
          <div className='cat_desktop_add_items'>
              <Input labelText={'Add New Item'} type={'text'} id={'add_item'} value={newItem} change={(e)=>setNewItem(e.target.value)}/>
              <Input labelText={'Add New note'} type={'text'} id={'add_note'} value={newNote} change={(e)=>setNewNote(e.target.value)}/>
              <Button text={'Add Item'} button_type={'primary'}  func={addItemButton}/>
          </div>

          {/* Display Section */}
          <div className="cat_list_display" style={{marginTop: '20px'}}>
            <h3>Current Categories</h3>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <strong>{cat.category}</strong> - {cat.note}
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
    </div>
  )
}

export default Cat_desktop