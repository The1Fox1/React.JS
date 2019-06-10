import React from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  NavItem,
  NavLink
} from "reactstrap";
import PropTypes from "prop-types";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import "./NavbarStyles.css";

const SortSubItem = SortableElement(({ item, clickFunc }) => (
  <DropdownItem onClick={clickFunc}>{item.name}</DropdownItem>
));

let SortSubList = SortableContainer(({ items, click }) => {
  return (
    <DropdownMenu className="dropdown-content">
      {items.subMenu.map((contents, indx) => {
        return (
          <SortSubItem
            key={`Parent:${items.id}-Id:${contents.id}`}
            index={indx}
            item={contents}
            clickFunc={click}
          />
        );
      })}
    </DropdownMenu>
  );
});
SortSubList = React.memo(SortSubList);

class CustomNavItem extends React.Component {
  state = {
    mappedChildren: [],
    children: [],
    dropOpen: false
  };

  toEditItem = e => {
    e.preventDefault();
    this.props.clickToEdit(this.props.items);
  };
  toEditSubItem = e => {
    e.preventDefault();
    this.props.clickToEdit(this.props.items.subMenu[e.target.id]);
  };

  mappingSubMenu = (item, index) => {
    return (
      <DropdownItem
        key={`${item.parentId}.${item.sortOrder}`}
        id={index}
        onClick={this.toEditSubItem}
      >
        {item.name}
      </DropdownItem>
    );
  };

  mappingChildren = () => {
    if (this.props.items.subMenu) {
      this.setState({
        children: this.props.items.subMenu,
        mappedChildren: this.props.items.subMenu.map(this.mappingSubMenu)
      });
    }
  };

  toggleDrop = () => {
    this.setState(state => {
      return {
        ...state,
        dropOpen: !state.dropOpen
      };
    });
  };

  componentDidMount = () => {
    this.mappingChildren();
  };

  render() {
    return this.state.mappedChildren.length > 0 ? (
      <NavItem
        className="draggable"
        style={this.props.styles && this.props.styles.navItem}
      >
        <Dropdown
          inNavbar
          onClick={this.toEditItem}
          isOpen={this.state.dropOpen}
          toggle={this.toggleDrop}
        >
          <DropdownToggle
            nav
            caret
            className="drag-dropdown"
            style={this.props.styles && this.props.styles.navLink}
          >
            {this.props.items.name}
          </DropdownToggle>
          <SortSubList
            axis="y"
            lockAxis="y"
            helperCLass="sortableHelper"
            items={this.props.items}
            click={this.toEditSubItem}
          />
        </Dropdown>
      </NavItem>
    ) : (
      <NavItem
        className="draggable"
        style={this.props.styles && this.props.styles.navItem}
      >
        <NavLink
          className="nav-link"
          onClick={this.toEditItem}
          style={this.props.styles && this.props.styles.navLink}
        >
          {this.props.items.name}
        </NavLink>
      </NavItem>
    );
  }
}

CustomNavItem.propTypes = {
  styles: PropTypes.object,
  items: PropTypes.object.isRequired,
  history: PropTypes.object,
  clickToEdit: PropTypes.func
};

export default CustomNavItem;
