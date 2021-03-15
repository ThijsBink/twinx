import React, { Component } from 'react'
import { inviteUserToGroupWithRole, requestAgentsList, requestGroupList, requestRolesList, requestUsersList } from '../api/endpoints';
import FormTemplate from '../components/admin/FormTemplate';
import Table from '../components/admin/Table';
import Formulas from '../components/admin/Formulas';
import apiContext from '../context/apiContext';
import {getCustomFormulas} from '../utils/local-storage'

export default class Admin extends Component {
   static contextType = apiContext


   constructor(props) {
      super(props);
      this.emailEl = React.createRef();
      this.roleEl = React.createRef();
      this.groupEl = React.createRef();
      this.messageEl = React.createRef();

      this.state = { 
         users: [],
         formulas : getCustomFormulas('ivXFzduo8aHT'),
         userTableHead: ['User ID', 'Name'],
         email : '',
         group : '',
         role : '',
         message : '',
         groups: [],
         agents: [],
         roles: [],
         formData: {
            formAction: {
               class: 'form',
            },
            formBody: []
            },
      }
   }

   componentDidMount() {
      const cont = this.context;
      Promise.all([
         requestUsersList(cont.applicationId, cont.token, cont.companyId),
         requestGroupList(cont.applicationId, cont.token, cont.companyId),
         requestRolesList(cont.applicationId, cont.token, cont.companyId),
         requestAgentsList(cont.applicationId, cont.token, cont.companyId)
      ]).then(([userList, groupList, roleList, agentList]) => {
         this.setState({users : userList})
         this.setState({groups : groupList})
         this.setState({roles : roleList})
         this.setState({agents: agentList})
         console.log(this.state)
         this.makeInviteForm();
      }).catch((err) => {
         console.log(err);
      });

      
   }



   makeInviteForm = () => {

      console.log('data!!', this.state.groups, this.state.roles)
      let groupSelect = [];
      let roleSelect = [];
      this.state.groups.forEach(group => {
         groupSelect.push({'label' : group.name, 'value' : group.publicId})
         console.log(groupSelect)
      });

      this.state.roles.forEach(role => {
         roleSelect.push({'label' : role.name, 'value' : role.publicId})
      });

      this.setState({formData : {
         formAction: {
            class: 'form',
         },
         formBody: [{
            type : 'email',
            name : 'email',
            placeholder : 'Email'
         },
         {
            type: 'select',
            name : 'group',
            values: groupSelect,
            classname: '',
         },
         {
            type: 'select',
            name : 'role',
            values: roleSelect,
            classname: ''
         },
         {
            type : 'text',
            name : 'message',
            placeholder : 'invite message',
            className : ''
         },
         {
            type : 'submit'
         }
      ]
      }});
   }

   handleInput = (type, name, e) => {
      console.log(type, name, e)
      if (name === 'email') {
         this.setState({email : e.target.value});
      } else if (name === 'group') {
         this.setState({group : e.value});
      } else if (name === 'role') {
         this.setState({role : e.value});
      } else if (name === 'message') {
         this.setState({message : e.target.value})
      }
   }

   handleForm = (e) => {
      e.preventDefault();
      console.log(this.state);
      if (this.state.email === '') {
         alert('no email provided');
         return;
      }

      if (this.state.group === '') {
         alert('no group provided');
         return;
      }

      if (this.state.role === '') {
         alert('no role provided');
         return;
      }

      this.inviteUser(this.state.email, this.state.group, this.state.role, this.state.message);

   }

   inviteUser = (email, group, role, message) => {
      const cont = this.context;
      inviteUserToGroupWithRole(
         cont.applicationId,
         this.context.token,
         this.context.companyId,
         'portal.ixon.cloud',
         group,
         role,
         email,
         message).then(res => console.log(res)); //TODO fix undefined.then()
   }

   render() {
      return (
         <div className="row">
            <div name="userTable" className="col-6">
               <h1>Users</h1>
               <div className='row'>
               <Table tableContent={this.state.users} />
               </div>
               <div className='row'>
               <Table tableContent={this.state.formulas} />
               </div>
            </div>
            <div className="col-3">
               <h1>Invite a user</h1>
               <FormTemplate formAction={this.handleForm} formFieldAction={this.handleInput} form={this.state.formData} />
            </div>
            <div className="col-3">
               <h1>Make custom calculation</h1>
               <Formulas agents={this.state.agents} groups={this.state.groups} roles={this.state.roles} />
            </div>

      </div>
      )
   }
}
