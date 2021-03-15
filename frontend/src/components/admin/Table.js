import React from 'react';

const Table = (props) => (
    <table className="table">
        <thead>{(props.tableContent).map((object, index) => {
            if (index === 0) {
                return <tr>{Object.keys(object).map((header, index) => {
                    return <th>{header}</th>
                })}</tr>
            } else {
                return '';
            }
        })}</thead>

        <tbody>
            {props.tableContent.map((content, index) => {
                return <tr>{Object.keys(content).map((index, value) => {
                   return <td>{content[index]}</td>;
                })}</tr>;
                })}
        </tbody>
    </table>
);

export default Table;
