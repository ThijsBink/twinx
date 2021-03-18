import React from 'react';
import './Modal.css';

const Modal = (props) => (
  <div className='modal-container'>
    <header className='modal-header'>
      <h1>{props.title}</h1>
    </header>
    <section className='modal-content'>{props.children}</section>
    <section className='modal-actions'>
      {props.canCancel && <button onClick={props.onCancel}>Cancel</button>}
      {props.canConfirm && <button onClick={props.onConfirm}>Confirm</button>}
    </section>
  </div>
);

export default Modal;
