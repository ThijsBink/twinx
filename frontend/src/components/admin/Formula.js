import React, { Component } from 'react'
import { FormControl } from 'react-bootstrap';
import Select from 'react-select';
import { getDataSources, getTagsList } from '../../api/endpoints';
import apiContext from '../../context/apiContext';
import {getCustomFormulas, saveCustomFormulas} from '../../utils/local-storage';


export default class Formula extends Component {
    static contextType = apiContext


    constructor(props) {
        super(props);
        this.state = {
            nrOfFields : 0,
            addFunction: false,
            fields : [],
            formula : {
                name : '',
                agent : '',
                source : '',
                values : []
            },
            operationsSelect : [{label: 'multiply', value : '*'}, {label: 'addition', value : '+'}, {label: 'divide', value : '/'}],
            agentSelect : [],
            sourceSelect : [],
            tagSelect : [],
            dataSourcesReady : false
        }
    }

    componentDidMount() {
        let agents = this.props.agents
        console.log(agents);
        let agentSelectArray = [];
        agents.forEach(agent => {
            agentSelectArray.push({value : agent.publicId, label : agent.name})
        })
        this.setState({agentSelect : agentSelectArray});

    }

    loadSources = (select) => {
        const con = this.context;
        this.setState({
            formula: {
                name : this.state.formula.name,
                agent: select.value,
                source: this.state.formula.source,
                values: this.state.formula.values
            }
        })
        Promise.all([
            getDataSources(con.applicationId, con.token, con.companyId, select.value),
            getTagsList(con.applicationId, con.token, con.companyId, select.value)
        ]).then(([sourceRes, tagRes]) => {
            let sourceListArray = [];
            let tagListArray = [];

            console.log(sourceRes)
            sourceRes.forEach(source => {
                sourceListArray.push({
                    value: source.publicId,
                    label: source.name
                })
            })

            tagRes.forEach(tag => {
                tagListArray.push({
                    value: tag.publicId,
                    label: tag.name
                })
            })

            this.setState({
                sourceSelect: sourceListArray
            })
            this.setState({
                tagSelect: tagListArray
            })
            this.setState({
                dataSourcesReady: true
            })

        }).catch((err) => {
            console.log(err);
        })

    }

    addName = (e) => {
        this.setState({formula : {
            name : e.target.value,
            agent : this.state.formula.agent,
            source : this.state.formula.source,
            values : this.state.formula.values
        }})
    }

    addSource = (source) => {
        this.setState({formula : {
            name : this.state.formula.name,
            agent : this.state.formula.agent,
            source : source.value,
            values : this.state.formula.values
        }})
    }

    addOperator = () => {
        let fieldsArray = this.state.fields;
        const operationSelect = <div className="form-control"><Select onChange={this.saveField.bind(this, this.state.fields.length)} options={this.state.operationsSelect} /></div>;
        fieldsArray.push({content : operationSelect, order : this.state.fields.length})
        this.setState({fields : fieldsArray});
    }

    addFunction = () => {
        let fieldsArray = this.state.fields;
        const tagSelect = <div className="form-control"><Select onChange={this.saveField.bind(this, this.state.fields.length)} options={this.state.tagSelect} /></div>;
        fieldsArray.push({content: tagSelect, order : this.state.fields.length});
        this.setState({fields : fieldsArray});
    }

    saveField = (index, select) => {
        console.log('select', select, index)
        let arr = this.state.formula.values;
        console.log(arr)
        arr[index] = select.value;
        this.setState({formula : {
            name : this.state.formula.name,
            agent : this.state.formula.agent,
            source : this.state.formula.source,
            values : arr
        }})
    }

    saveFormula = () => {
        let customFormulas = getCustomFormulas(this.state.formula.agent);

        if (customFormulas.length === undefined) {
            customFormulas = [];
        }

        new Promise((resolve, reject) => {
            try {
                customFormulas.push(this.state.formula);
                saveCustomFormulas(this.state.formula.agent, customFormulas)
                resolve();
            } catch (e) {
                reject(e);
            }        
        }).then(
            this.setState({addFunction : false,
                fields : [],
                formula : {
                agent : '',
                source : '',
                values : []
            }})
        ).then(
            this.props.update
        )

    }
    
    render() {
        return (
            <div>
            <div className='row'>
                <button className='btn-danger' onClick = {
                    () => {
                        if (this.state.addFunction === false) {
                            this.setState({
                                addFunction: true
                            })
                        } else {
                            this.setState({
                                addFunction: false,
                                fields: [],
                                formula : {
                                    name : '',
                                    agent : '',
                                    source : '',
                                    values : ''
                                }
                            })
                        }
                    }}>
                    Add function
                </button>
                </div>
                {
                    this.state.addFunction === true ?
                    <div className=''>
                    <div className='form-control'><FormControl type='text' placeholder='Formula name' onChange={this.addName} /></div>
                    <div className='form-control'><Select onChange={this.loadSources.bind(this)} options={this.state.agentSelect} /></div>
                    {this.state.dataSourcesReady === true ?
                        <div>
                            <div className='form-control'>
                                <Select onChange={this.addSource.bind(this)} options={this.state.sourceSelect} />
                            </div>
                            <div className='form-control'>
                                <button className='btn btn-primary' onClick={this.addFunction}>Add field</button>
                            </div>
                            <div className='form-control'>
                                <button className='btn btn-primary' onClick={this.addOperator}>Add operator</button>
                            </div>
                            <div>
                                {this.state.fields.map((value, index) => {
                                    return <div key={index}>{value.content}</div>;
                                })}
                            </div>
                            <div className='form-control'>
                                <button className='btn btn-secondary' onClick={this.saveFormula}>Save Formula</button>
                            </div>
                        </div>
                        :
                        ''
                    }
                </div>
                    :
                    ''
                }

            </div>
        )
    }
}
