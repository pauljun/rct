import React from 'react'
// import UserInfo from '../userInfo'
const UserInfo = Loader.loadBusinessComponent('UserInfo')
class AddOrEditUser extends React.Component {
  render() {
    return (
      <UserInfo userView='userModify'/>
    )
      
 }
} 
export default AddOrEditUser