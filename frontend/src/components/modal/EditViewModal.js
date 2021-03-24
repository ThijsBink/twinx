import React, { useState, useEffect } from 'react';
import Backdrop from '../backdrop/Backdrop';
import ColorPicker from '../inputs/ColorPicker';

import './EditViewModal.css';
import { Form } from 'react-bootstrap';

export default function EditViewModal({
  isCreate,
  onCancel,
  onConfirm,
  dataSourceList,
  tagList,
  view,
}) {
  console.log({
    isCreate,
    onCancel,
    onConfirm,
    dataSourceList,
    tagList,
    view,
  });

  const [name, setName] = useState(isCreate ? '' : view.name);
  const [color, setColor] = useState(isCreate ? '#efeaff' : view.color);
  const [dataSource, setDataSource] = useState(
    isCreate
      ? dataSourceList[0].publicId
      : dataSourceList.find((ds) => ds.publicId === view.dataSourceId)
  );
  const [tag, setTag] = useState(
    isCreate
      ? tagList[0].publicId
      : tagList.find((t) => t.publicId === view.tagsIds[0])
  );
  const [hours, setHours] = useState(isCreate ? 3 : view.hours);

  //   useEffect(() => {
  //     console.log(name, color, dataSource, tag, hours);
  //   }, [name, color, dataSource, tag, hours]);

  const onConfirmHandler = () => {
    if (
      name.trim().length === 0 ||
      hours > 120 ||
      hours < 1 //||
      // \!Number.isInteger(hours)
    ) {
      // console.log(name.trim().length === 0, hours > 120, hours < 1, hours);
      return;
    }
    console.log('lol');
    onConfirm(name, color, dataSource, tag, Math.floor(hours));
  };

  return (

    <>
       <Backdrop />
       <div className='modal-container'>
         <header className='modal-header'>
           <h1>{isCreate ? 'Create new view' : 'Edit view'}</h1>
           <button className="btn-close" onClick={onCancel}>X</button>
         </header>
         <Form>
           <Form.Group>
             <Form.Label>Name</Form.Label>
             <Form.Control className="field" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="" />
           </Form.Group>

           <Form.Group>
             <Form.Label>Data Source</Form.Label>
             <Form.Control
              as="select"
              className="mr-sm-2"
              id="inlineFormCustomSelect"
              name='data-source'
              value={dataSource.publicId}
              onChange={(e) => setDataSource(e.target.value)}
              custom
            >
              {dataSourceList.map((ds) => (
                <option key={ds.publicId} value={ds.publicId}>
                  {ds.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Formula</Form.Label>
            <Form.Control
                as="select"
                className="mr-sm-2"
                id="inlineFormCustomSelect"
                name='tag'
                value={tag.name}
                onChange={(e) => setTag(e.target.value)}
                custom
            >
              {tagList.map((t) => (
                <option key={t.publicId} value={t.publicId}>
                  {t.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <ColorPicker value={color} onChange={(c) => setColor(c)} />
          </Form.Group>
          <Form.Group>
            Collect{' '}
            <input
              type='number'
              min='1'
              max='120'
              step='1'
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />{' '}
            hours
          </Form.Group>
          <button className="view-btn" onClick={() => onConfirmHandler()}>Confirm</button>
        </Form>
      </div>

    </>
  );
}
