import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import Default from './Default'
import Indeterminate from './Indeterminate'
import Labeled from './Labeled'

class Template extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  componentDidMount() {
    const defaultContainer = document.getElementById("default-checkbox");
    ReactDOM.render(<Default/>, defaultContainer);

    const indeterminateContainer = document.getElementById("indeterminate-checkbox");
    ReactDOM.render(<Indeterminate/>, indeterminateContainer);

    const labeledContainer = document.getElementById("labeled-checkbox");
    ReactDOM.render(<Labeled/>, labeledContainer);
  } 

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
export default Template;
