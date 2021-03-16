import React, { Component } from 'react'
import apiContext from '../../context/apiContext';
import Formula from './Formula';

export default class Formulas extends Component {
    static contextType = apiContext


    constructor(props) {
        super(props);
        this.state = {
            formulas : [],
            addFuntion : false
        }
    }

    componentDidMount() {
        // const cont = this.context;

    }

    onSave = () {
        alert('saved');
    }

    addFunction = () => {
        alert('clicked');
    }

    render() {
        return (
            <div>
                <Formula />
                {/* <div className="row">
                    <button className='btn-danger' onClick = {
                    () => {
                        if (this.state.addFuntion === false) {
                            this.setState({
                                addFuntion: true
                            })
                        } else {
                            this.setState({
                                addFuntion: false
                            })
                        }
                    }}>
                    Add function
                    </button>
                </div>
                {this.state.addFuntion === true ? <Formula agents={this.props.agents}/> : ''} */}
            </div>
        )
    }
}
