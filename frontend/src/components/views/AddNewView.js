import React, { useRef } from 'react';

import './AddNewView.css';

export default function AddNewView({ tags, dataSources, createViewHandler }) {
  const nameRef = useRef();
  const dataSourceRef = useRef();
  const tagIdRef = useRef();
  const typeRef = useRef();

  function handleNewViewSubmission(e) {
    e.preventDefault();

    createViewHandler(
      nameRef.current.value,
      dataSourceRef.current.value,
      tagIdRef.current.value,
      typeRef.current.value
    );
  }

  return (
    <form className='add-new-view-form' onSubmit={handleNewViewSubmission}>
      <div className='selections'>
        <div>
          <h4>Name</h4>
          <input type='text' ref={nameRef} />
        </div>
        <div>
          <h4>Data Source</h4>
          <select name='data-source' ref={dataSourceRef}>
            {dataSources.map((dataSource) => (
              <option key={dataSource.publicId} value={dataSource.publicId}>
                {dataSource.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h4>Tag</h4>
          <select name='tag' ref={tagIdRef}>
            {tags.map((tag) => (
              <option key={tag.publicId} value={tag.publicId}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h4>Type</h4>
          <select name='type' ref={typeRef}>
            <option value='chart'>Chart</option>
          </select>
        </div>
      </div>
      <div className='button-container'>
        <button type='submit'>Add</button>
      </div>
    </form>
  );
}
