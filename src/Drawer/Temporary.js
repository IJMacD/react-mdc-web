import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

const ROOT = 'mdc-temporary-drawer';

const cssClasses = {
  ROOT,
  DRAWER_SELECTOR: `${ROOT}__drawer`,
  HEADER: `${ROOT}__header`,
  OPEN: `${ROOT}--open`,
  ANIMATING: `${ROOT}--animating`,
  RIGHT: `${ROOT}--right`,
  OPACITY_VAR_NAME: `--${ROOT}-opacity`,
};

class Temporary extends Component {

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    target: PropTypes.string,
    header: PropTypes.oneOf([PropTypes.string, PropTypes.node]),
  };

  static handleDrawerClick(event) {
    event.stopPropagation();
  }

  constructor(props) {
    super(props);
    this.handleMenuToggle = this.handleMenuToggle.bind(this);
    this.handleShadeClick = this.handleShadeClick.bind(this);
    this.handleDrawerRef = this.handleDrawerRef.bind(this);
    this.handleShadeRef = this.handleShadeRef.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.handleTouchstart = this.handleTouchstart.bind(this);
    this.handleTouchmove = this.handleTouchmove.bind(this);
    this.handleTouchend = this.handleTouchend.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.state = {};
  }

  componentDidMount() {
    const toggle = document.getElementById(this.props.target);
    if (toggle) {
      toggle.addEventListener('click', this.handleMenuToggle);
    }
  }

  handleMenuToggle(event) {
    event.stopPropagation();
    if (this.state.open) {
      this.close();
    } else {
      this.open();
    }
  }

  handleDrawerRef(nativeDrawer) {
    this.drawer = nativeDrawer;
    this.drawer.addEventListener('click', Temporary.handleDrawerClick);
    this.drawer.addEventListener('touchstart', this.handleTouchstart);
  }

  handleShadeRef(nativeShade) {
    this.shade = nativeShade;
    this.shade.addEventListener('click', this.handleShadeClick);
    this.shade.addEventListener('touchmove', this.handleTouchmove);
    this.shade.addEventListener('touchend', this.handleTouchend);
  }

  handleShadeClick() {
    this.close();
  }

  handleTouchstart({ pointerType, touches, pageX }) {
    if (!this.state.open) {
      return;
    }

    if (pointerType && pointerType !== 'touch') {
      return;
    }

    this.startX = touches ? touches[0].pageX : pageX;
    this.touchingSideNav = true;
    this.drawerWidth = this.drawer.offsetWidth;
    this.setState({ currentX: this.startX });
  }

  handleTouchmove({ pointerType, touches, pageX }) {
    if (pointerType && pointerType !== 'touch') {
      return;
    }
    const currentX = touches ? touches[0].pageX : pageX;
    this.setState({ currentX });
  }

  handleTouchend({ pointerType }) {
    if (pointerType && pointerType !== 'touch') {
      return;
    }
    this.touchingSideNav = false;
    this.drawer.style.setProperty('transform', null);
    this.shade.style.setProperty(cssClasses.OPACITY_VAR_NAME, '');
    const newPosition = Math.min(0, this.state.currentX - this.startX);
    // Did the user close the drawer by more than 50%?
    if (Math.abs(newPosition / this.drawerWidth) >= 0.5) {
      this.close();
    } else {
      // Triggering an open here means we'll get a nice animation back to the fully open state.
      this.open();
    }
  }

  open() {
    this.drawer.addEventListener('transitionend', this.handleTransitionEnd);
    this.setState({ open: true, animating: true });
  }

  close() {
    this.setState({ open: false, animating: true });
  }

  handleTransitionEnd() {
    this.drawer.removeEventListener('transitionend', this.handleTransitionEnd);
    this.setState({ animating: false });
  }

  updateDrawer() {
    if (!this.touchingSideNav) {
      return;
    }
    const newPosition = Math.min(0, this.state.currentX - this.startX);
    const newOpacity = Math.max(0, 1 + (1 * (newPosition / this.drawerWidth)));
    this.drawer.style.setProperty('transform', `translateX(${newPosition}px)`);
    this.shade.style.setProperty(cssClasses.OPACITY_VAR_NAME, newOpacity);
  }

  render() {
    const { className, children, ...otherProps } = this.props;
    const { open, animating } = this.state;

    const childs = React.Children.map(children, child =>
      React.cloneElement(child, { temporary: true }),
    );

    this.updateDrawer();

    return (
      <aside
        className={classnames(cssClasses.ROOT, {
          [cssClasses.OPEN]: open,
          [cssClasses.ANIMATING]: animating,
        }, className)}
        {...otherProps}
        ref={this.handleShadeRef}
      >
        <nav
          className={cssClasses.DRAWER_SELECTOR}
          ref={this.handleDrawerRef}
        >
          { childs }
        </nav>
      </aside>
    );
  }
}

export default Temporary;
