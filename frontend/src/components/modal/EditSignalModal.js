import React, { useState, useEffect } from 'react';
import Backdrop from '../backdrop/Backdrop';
import ColorPicker from '../inputs/ColorPicker';

export default function EditViewModal({ onCancel, onConfirm }) {
  return (
    <>
      <Backdrop />
      <div className='modal-container'>
        <header className='modal-header'>
          <h1>Signal</h1>
          <button onClick={onCancel}>X</button>
        </header>
        <section className='modal-content'>
          <form className='add-new-view-form'>
            <div className='selections'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  margin: '2px',
                }}
              >
                <select style={{ marginLeft: '5px' }}>
                  <option>None</option>
                  <option>Greater than</option>
                  <option>Smaller than</option>
                </select>
                <input type='number' min='1' max='120' step='1' />
              </div>
            </div>
          </form>
        </section>
        <section className='modal-actions'>
          <button onClick={onConfirm}>Confirm</button>
        </section>
      </div>
    </>
  );
}
