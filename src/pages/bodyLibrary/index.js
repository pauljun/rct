/**
 * @desc 人脸图库
 */

import React from 'react'
import Wrapper from './components/wrapper'
/**拖拽 */
const DragDropContextProvider = Loader.loadComponent(
  "ReactDnD",
  null,
  "DragDropContextProvider"
)

export default class BodyLibraryIndex extends React.Component {
  state = {
    HTML5Backend: null
  }
  componentWillMount(){
    Loader.loadScript("HTML5Backend", 'default').then(HTML5Backend => {
      this.setState({HTML5Backend})
    })
  }
  render(){
    const { HTML5Backend } = this.state
    if(!HTML5Backend){
      return null
    }
    return <DragDropContextProvider backend={HTML5Backend}>
      <Wrapper />
    </DragDropContextProvider>
  }
}
