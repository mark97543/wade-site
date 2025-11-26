import React, {useState} from 'react'
import {Input, Button} from '@wade/ui'

function Cat_desktop({selected}) {
  const [newItem, setNewItem] = useState('')
  const [newNote, setNewNote] = useState('')



  return (
    <div className={selected === "cat" ? "budget_desktop_selected" : "budget_desktop_not_selected"} >
        <div className='cat_desktop_wrapper'>

          <div className='cat_desktop_add_items'>
              <Input labelText={'Add New Item'} type={'text'} id={'add_item'} value={newItem} change={(e)=>setNewItem(e.target.value)}/>
              <Input labelText={'Add New note'} type={'text'} id={'add_note'} value={newNote} change={(e)=>setNewNote(e.target.value)}/>
              <Button text={'Add Item'} button_type={'primary'} />
          </div>

        </div>
    </div>
  )
}

export default Cat_desktop