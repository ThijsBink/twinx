import React from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';

const FormTemplate = (props) => (

    <Form className={props.form.formAction.class} onSubmit={props.formAction.bind(this)}>
        {props.form.formBody.map((input, index) => {
            if (input.type !== 'select') {
                return <div key={index} className="form-control"><Form.Control type={input.type} onChange={props.formFieldAction.bind(this, 'input', input.name)} name={input.name} className={input.classname} placeholder={input.placeholder} /></div>
            } else if (input.type === 'select') {
                return <div key={index} className="form-control"><Select onChange={props.formFieldAction.bind(this, 'select', input.name)} options={input.values}/></div>
            } else {
                return '';
            }
        })}

    </Form>
);

export default FormTemplate;