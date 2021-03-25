import React, { useState, useEffect } from 'react';
import Backdrop from '../backdrop/Backdrop';
import ColorPicker from '../inputs/ColorPicker';

import './EditViewModal.css';

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
          <button onClick={onCancel}>X</button>
        </header>
        <section className='modal-content'>
          <form className='add-new-view-form'>
            <div className='selections'>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginRight: '1rem',
                }}
              >
                <div style={{ display: 'flex', margin: '2px' }}>
                  <h4>Name</h4>
                  <input
                    style={{ marginLeft: '5px' }}
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <ColorPicker value={color} onChange={(c) => setColor(c)} />
                </div>
              </div>
              <div style={{ display: 'flex', margin: '2px' }}>
                <h4>Data Source</h4>
                <select
                  style={{ marginLeft: '5px' }}
                  name='data-source'
                  value={dataSource.publicId}
                  onChange={(e) => setDataSource(e.target.value)}
                >
                  {dataSourceList.map((ds) => (
                    <option key={ds.publicId} value={ds.publicId}>
                      {ds.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', margin: '2px' }}>
                <h4>Formula</h4>
                <select
                  style={{ marginLeft: '5px' }}
                  name='tag'
                  value={tag.name}
                  onChange={(e) => setTag(e.target.value)}
                >
                  {tagList.map((t) => (
                    <option key={t.publicId} value={t.publicId}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
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
              </div>
            </div>
          </form>
        </section>
        <section className='modal-actions'>
          <button onClick={() => onConfirmHandler()}>Confirm</button>
        </section>
      </div>
    </>
  );
}
