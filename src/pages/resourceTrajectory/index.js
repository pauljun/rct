import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'
import Trajectory from './components/Trajectory'
import './index.less'

const NoData = Loader.loadBaseComponent('NoData')
const Loading = Loader.Loading

@withRouter
@observer
class TrajectoryComponent extends Component {
  constructor(props){
    super(props)
    this.hasData = false
    this.id = Utils.queryFormat(props.location.search).id
    this.state = {
      loading: true
    }
  }
  componentWillMount(){
    if(this.id){
      LM_DB.get('parameter', this.id)
      .then(res => {
        this.setState({ loading: false })
        if(res){
          this.hasData = true;
          this.setState({
            list: res.list,
            type: res.type
          })
        }
      })
    } else {
      this.setState({ loading: false })
    }
  }
  render(){
    if(this.state.loading) {
      return <Loading />
    }
    if(!this.hasData){
			return <NoData />
		}
    const { list, type } = this.state;
    return (
      <Trajectory 
        list={list}
        type={type}
      />
    )
  }
}
export default TrajectoryComponent