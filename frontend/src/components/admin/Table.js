import React from 'react';

const Table = (props) => (
    <table className="table">
        <thead>{(props.tableContent).map((object, index) => {
            if (index === 0) {
                return<tr key={index}>{Object.keys(object).map((header, i) => {
                    return<th key={i}>{header}</th>;
                })}</tr>
            } else {
                return '';
            }
        })}</thead>

        <tbody>
            {props.tableContent.map((content, index) => {
                return<tr key={index}>{Object.keys(content).map((index, value) => {
                   return<td key={value}>{content[index]}</td>;
                })}
                {props.deleteFunction !== undefined ? <td className="btn btn-warning" onClick={props.deleteFunction.bind(this, content)}>Del</td> : ''}
                </tr>;
                })}
        </tbody>
    </table>
);

export default Table;
