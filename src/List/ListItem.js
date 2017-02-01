import React, { PropTypes } from 'react';
import classnames from 'classnames';

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const ListItem = ({ className, children, ...otherProps }) => (
  <li
    className={classnames('mdc-list-item', className)}
    {...otherProps}
  >
    {children}
  </li>
  );
ListItem.propTypes = propTypes;
export default ListItem;
