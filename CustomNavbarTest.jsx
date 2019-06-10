import React from "react";
import {
  Navbar,
  Nav,
  NavItem,
  Collapse,
  NavbarBrand,
  Button
} from "reactstrap";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import * as pageServices from "./"; //------------------
import * as customStyleServices from "./"; //
import * as vendServices from "./"; //    Removed code for Proprietary reasons
import * as venOwServices from "./"; //
import * as proServices from "./"; //------------------
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import logger from "../../../logger";
import CustomNavItem from "./CustomNavItem";
import NavModal from "./NavModal";
import StylingModal from "./StylingModal";
import "../../layout/Header.css";
import "./NavbarStyles.css";

const _logger = logger.extend("Brand");

const SortableItem = SortableElement(({ value, clickFunc, styles }) => (
  <CustomNavItem items={value} clickToEdit={clickFunc} styles={styles} />
));
let SortableList = SortableContainer(({ items, click, editMode, styles }) => {
  return (
    <Nav className="Ulist navbar-nav">
      {items.map((contents, indx) => {
        return (
          <SortableItem
            key={`Id:${contents.id}-Indx:${indx}`}
            index={indx}
            value={contents}
            clickFunc={click}
            disabled={editMode}
            styles={styles}
          />
        );
      })}
    </Nav>
  );
});
SortableList = React.memo(SortableList);

class CustomNavbar extends React.Component {
  state = {
    roleTypeId: 0,
    role: "",
    entity: {},
    dataArr: [],
    editedItem: {
      name: "",
      link: "",
      sortOrder: 0,
      parentId: 0
    },
    modalIsOpen: false,
    isToolsCollapsed: false,
    stylesIsOpen: false
  };

  componentDidMount = () => {
    this.setState(
      () => {
        return {
          roleTypeId: this.getRoleTypeId(this.props.role),
          role: this.props.role
        };
      },
      () => {
        this.getEntityById(this.state.roleTypeId, this.props.entityId);

        customStyleServices
          .getByEntityId(this.state.roleTypeId, this.props.entityId)
          .then(this.getStyleSuccess)
          .catch(this.getStyleFail);
      }
    );
  };

  //
  //Removed code for Proprietary reasons
  //

  getStyleSuccess = data => {
    const style = JSON.parse(data.item.style);
    this.setState(() => {
      return { styles: style, styleId: data.item.id };
    });
  };
  getStyleFail = xhr => {
    _logger("Couldn't get styles: ", xhr);
  };
  getEntityById = (roleTypeId, id) => {
    switch (roleTypeId) {
      case 2:
        venOwServices
          .getId(id)
          .then(this.getEntityByIdSuccess)
          .catch(this.getEntityByIdError);
        break;
      case 3:
        vendServices
          .getById(id)
          .then(this.getEntityByIdSuccess)
          .catch(this.getEntityByIdError);
        break;
      case 4:
        proServices
          .getPromoterById(id)
          .then(this.getEntityByIdSuccess)
          .catch(this.getEntityByIdError);
        break;
      default:
        return null;
    }
  };
  getEntityByIdSuccess = data => {
    this.setState(
      () => {
        return {
          entity: data.item
        };
      },
      () => {
        pageServices
          .getNavElements(this.state.roleTypeId, this.props.entityId)
          .then(this.getMenuItemsSuccess)
          .catch(this.getMenuItemsError);
      }
    );
  };

  getRoleTypeId = urlRole => {
    if (urlRole.includes("v***e")) return 2; //
    if (urlRole.includes("v***r")) return 3; // Removed code for Proprietary reasons
    if (urlRole.includes("p***r")) return 4; //
    return null;
  };

  getEntityByIdError = () => {
    toast.info("Navbar couldn't find this ****");
  };
  getMenuItemsSuccess = data => {
    this.setState(
      () => {
        return { dataArr: data.items };
      },
      () => {
        _logger("Recieved Menu Items: ", this.state.dataArr);
      }
    );
  };
  getMenuItemsError = xhr => {
    _logger("No navbar saved for this entity", xhr);
  };

  submitNavItem = values => {
    if (values.id) {
      this.saveItem(values, values.id);
    } else {
      this.saveItem(values);
    }
  };
  saveItem = values => {
    const payload = {
      ...values,
      pageTypeId: 3, // 3 => Navigation Type
      isNavigation: true,
      dateToExpire: "5/31/2020",
      role: this.props.role,
      entityId: this.props.entityId
    };
    this.reoderArray(payload);
  };
  saveItemSuccess = () => {
    toast.success("Successfully saved item");
  };
  saveItemError = () => {
    toast.error("Oh no. Couldn't save this");
  };
  deleteItem = id => {
    this.setState(state => {
      const newArr = [...state.dataArr];
      const indx = newArr.findIndex(el => el.id === id);
      newArr.splice(indx, 1);

      return { dataArr: newArr };
    });
    pageServices
      .deletePage(id)
      .then(this.deleteItemSuccess)
      .catch(this.deleteItemError);
  };
  deleteItemSuccess = () => {
    toast.success("Deleted item");
  };
  deleteItemError = () => {
    toast.warning("Couldn't Delete");
  };
  submitNavStyling = (values, id) => {
    let payload = {
      style: JSON.stringify({ ...values }),
      roleTypeId: this.state.roleTypeId,
      entityId: this.props.entityId
    };
    if (id) {
      payload.id = id;
      customStyleServices
        .updateStyle(payload)
        .then(this.updateStyleSuccess)
        .catch(this.updateStyleError);
    } else {
      customStyleServices
        .createStyle(payload)
        .then(this.createStyleSuccess)
        .catch(this.createStyleError);
    }
  };
  createStyleSuccess = data => {
    this.setState({ styleId: data.id, styles: JSON.parse(data.style) });

    toast.success("Saved style");
  };
  createStyleError = xhr => {
    _logger("Could't insert style ", xhr);
    toast.error("Couldn't Save");
  };
  updateStyleSuccess = payload => {
    this.setState({ styles: JSON.parse(payload.style) });
  };
  updateStyleError = () => {
    toast.error("Couldn't update style");
  };

  reoderArray = newItem => {
    //Used for Inserts and Edits
    const grabWrap = () => {
      this.props.grabState(this.state.dataArr);
    };

    this.setState(state => {
      const newArr = [...state.dataArr];

      if (newItem.id) {
        const oldItem = newArr.find(el => el.id === newItem.id);
        newArr.splice(oldItem.sortOrder - 1, 1);
      }
      newArr.splice(newItem.sortOrder - 1, 0, newItem);
      newArr.forEach((elem, indx) => {
        elem.sortOrder = indx + 1;
      });
      return {
        ...state,
        dataArr: newArr
      };
    }, grabWrap);
  };

  onNavItemClick = itemData => {
    this.setState(state => {
      return {
        ...state,
        modalIsOpen: !state.modalIsOpen,
        editedItem: itemData
      };
    });
  };
  createNewNavItem = () => {
    this.setState({ editedItem: {} });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState(state => {
      return { modalIsOpen: !state.modalIsOpen };
    });
  };
  toggleEditMode = e => {
    e.preventDefault();
    this.setState(state => {
      return { editMode: !state.editMode };
    });
  };
  toggleNavbar = e => {
    e.preventDefault();
    this.setState(state => {
      return { isToolsCollapsed: !state.isToolsCollapsed };
    });
  };
  toggleStyleModal = () => {
    this.setState(state => {
      return { stylesIsOpen: !state.stylesIsOpen };
    });
  };

  onDrop = (data, event) => {
    //Used for GUI/DradNDrop only
    const { oldIndex, newIndex } = data;
    _logger("Picked up at index " + oldIndex + " and dropped at " + newIndex);
    _logger(event);
    if (newIndex === oldIndex || newIndex === null) {
      return;
    }

    this.setState(state => {
      const newArr = [...state.dataArr];

      const movedItem = newArr.splice(oldIndex, 1)[0];
      newArr.splice(newIndex, 0, movedItem);
      newArr.forEach((elem, indx) => {
        elem.sortOrder = indx + 1;
      });

      return {
        ...state,
        dataArr: newArr
      };
    }, this.props.grabState(this.state.dataArr));
  };

  render() {
    return (
      <React.Fragment>
        {this.props.showNavbarEdit && (
          <Navbar
            className="py-0 pl-5"
            style={{ backgroundColor: "lightgrey" }}
          >
            <Collapse isOpen={!this.state.isToolsCollapsed}>
              <Nav>
                <OverlayTrigger
                  placement={"top"}
                  overlay={
                    <Tooltip>
                      Customize the style and color of your navbar
                    </Tooltip>
                  }
                >
                  <NavItem className="mx-5">
                    <Button color="info" onClick={this.toggleStyleModal}>
                      Style Navbar
                    </Button>
                  </NavItem>
                </OverlayTrigger>
                <OverlayTrigger
                  placement={"top"}
                  overlay={<Tooltip>Add a new link to the navbar</Tooltip>}
                >
                  <NavItem className="mx-5">
                    <Button color="primary" onClick={this.createNewNavItem}>
                      Add Link
                      <span className="pl-1">
                        <i className="fas fa-plus" />
                      </span>
                    </Button>
                  </NavItem>
                </OverlayTrigger>
              </Nav>
            </Collapse>

            <OverlayTrigger
              placement={"top"}
              overlay={<Tooltip>Collapse</Tooltip>}
            >
              <button
                onClick={this.toggleNavbar}
                className={
                  this.state.isToolsCollapsed
                    ? "navbar-toggler py-0 ml-auto"
                    : "navbar-toggler"
                }
              >
                {this.state.isToolsCollapsed ? (
                  <i className="fas fa-tools fa-xs" />
                ) : (
                  <i className="fas fa-tools fa-2x" />
                )}
              </button>
            </OverlayTrigger>
          </Navbar>
        )}
        <Navbar
          expand="md"
          className="border"
          color="faded"
          style={this.state.styles && this.state.styles.navbar}
        >
          <NavbarBrand href="/*******" title="Home">
            <img
              className="img-fluid navbar-logo"
              src="/*******"
              alt="****'s ***** Home Page"
              style={{ height: "31px", objectFit: "contain" }}
            />
          </NavbarBrand>

          <SortableList
            axis="xy"
            // lockAxis="x"
            distance={20}
            helperClass="sortableHelper"
            items={this.state.dataArr}
            onSortEnd={this.onDrop}
            click={this.onNavItemClick}
            editMode={this.state.editMode}
            styles={this.state.styles}
          />
        </Navbar>

        <NavModal
          roleTypeId={this.state.roleTypeId}
          deleteItem={this.deleteItem}
          toggleModal={this.toggleModal}
          submitNav={this.submitNavItem}
          editedItem={this.state.editedItem}
          modalIsOpen={this.state.modalIsOpen}
          entityName={this.state.entity ? this.state.entity.businessName : " "}
        />
        <StylingModal
          styleId={this.state.styleId}
          editStyles={this.state.styles}
          submitCall={this.submitNavStyling}
          toggleModal={this.toggleStyleModal}
          modalIsOpen={this.state.stylesIsOpen}
          entityName={this.state.entity ? this.state.entity.businessName : " "}
        />
      </React.Fragment>
    );
  }
}

export default CustomNavbar;

CustomNavbar.propTypes = {
  role: PropTypes.string,
  currentUser: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  entityId: PropTypes.number,
  showNavbarEdit: PropTypes.bool.isRequired,
  grabState: PropTypes.func.isRequired
};
