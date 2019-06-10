import React from "react";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Row
} from "reactstrap";
// import logger from "../../../logger";
import { Formik, Form, Field } from "formik";
import PropTypes from "prop-types";

// const _logger = logger.extend("Brand");

const StylingModal = props => {
  const submitStyles = values => {
    const payload = {
      navbar: {
        backgroundColor: values.navColor,
        fontFamily: values.fontFamily,
        fontWeight: values.fontWeight,
        fontStyle: values.fontStyle
      },
      navItem: {
        backgroundColor: values.menuColor,
        borderColor: values.borderColor,
        borderWidth: values.borderWidth,
        borderStyle: values.borderStyle,
        borderRadius: values.borderRadius,
        marginLeft: values.itemMargin,
        marginRight: values.itemMargin
      },
      navLink: {
        color: values.color,
        paddingLeft: values.padding,
        paddingRight: values.padding
      }
    };

    if (values.navMargin === "right") {
      payload.navbar["marginRight"] = "auto";
      payload.navbar["marginLeft"] = "auto";
    } else if (values.navMargin === "right") {
      payload.navbar["marginRight"] = "auto";
    } else {
      payload.navbar["marginLeft"] = "auto";
    }
    props.toggleModal();
    props.submitCall(payload, props.styleId);
  };

  const flattenedStyles = obj => {
    if (typeof obj === "string") obj = JSON.parse(obj);

    obj.menuColor = obj.navItem ? obj.navItem.backgroundColor : "";
    obj.navColor = obj.navbar ? obj.navbar.backgroundColor : "";
    obj.navMargin = obj.navbar ? obj.navbar.marginLeft : "";
    obj.itemMargin = obj.navItem ? obj.navItem.marginRight : "";
    return Object.assign(
      {},
      ...(function _flatten(o) {
        return [].concat(
          ...Object.keys(o).map(k =>
            typeof o[k] === "object" ? _flatten(o[k]) : { [k]: o[k] }
          )
        );
      })(obj)
    );
  };
  return (
    <Modal isOpen={props.modalIsOpen} toggle={props.toggleModal}>
      <ModalHeader toggle={props.toggleModal} className="bg-primary rounded">
        Edit Navbar Styles : <strong>{props.entityName}</strong>
      </ModalHeader>

      <Formik
        enableReinitialize={true}
        initialValues={
          props.editStyles
            ? flattenedStyles(props.editStyles)
            : { navMargin: "left" }
        }
        onSubmit={submitStyles}
      >
        {props => {
          const { values, handleSubmit } = props;

          return (
            <React.Fragment>
              <Form onSubmit={handleSubmit}>
                <ModalBody className="px-4">
                  <Row className="pb-3">
                    <Col>
                      <FormGroup>
                        <h5>Align Menu Items</h5>
                        <FormGroup
                          inline
                          className="border border-black rounded pt-1"
                        >
                          <Label>
                            Right
                            <Field
                              className="pl-1"
                              checked={values.margin === "left"}
                              name="navMargin"
                              value="left"
                              type="radio"
                            />
                          </Label>
                          <Label className="pl-1">
                            Center
                            <Field
                              name="navMargin"
                              value="center"
                              type="radio"
                            />
                          </Label>
                          <Label className="pl-1">
                            Left
                            <Field
                              name="navMargin"
                              value="right"
                              type="radio"
                            />
                          </Label>
                        </FormGroup>
                      </FormGroup>
                    </Col>
                    <Col className="px-0">
                      <FormGroup>
                        <Col>
                          <Label>Item Width</Label>
                          <Field
                            className="border rounded boder-light"
                            component="select"
                            name="padding"
                          >
                            <option value="0px">None</option>
                            <option value="4px">4px</option>
                            <option value="8px">8px</option>
                            <option value="16px">16px</option>
                            <option value="24px">24px</option>
                          </Field>
                        </Col>
                      </FormGroup>
                    </Col>
                    <Col className="px-0">
                      <FormGroup>
                        <Col>
                          <Label>Item Spacing</Label>
                          <Field
                            className="border rounded boder-light"
                            component="select"
                            name="itemMargin"
                          >
                            <option value="0px">None</option>
                            <option value="4px">4px</option>
                            <option value="8px">8px</option>
                            <option value="16px">16px</option>
                            <option value="24px">24px</option>
                          </Field>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="pb-3">
                    <Col>
                      <FormGroup style={{ color: values.color }}>
                        <Label style={{ paddingBottom: "21px" }}>
                          Text Color{" "}
                        </Label>
                        <br />
                        <Field name="color" type="color" className="rounded" />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup
                        style={{
                          backgroundColor: values.navColor,
                          borderRadius: "10px",
                          paddingLeft: "5px"
                        }}
                      >
                        <Label>Navbar Background</Label>
                        <Field
                          className="rounded"
                          name="navColor"
                          type="color"
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Item Backgrounds</Label>
                        <Field
                          className="rounded"
                          style={{ backgroundColor: values.menuColor }}
                          name="menuColor"
                          type="color"
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Items have Borders </Label>
                        <Field type="checkbox" name="border" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row
                    hidden={!values.border}
                    style={{
                      borderColor: values.borderColor,
                      borderRadius: values.borderRadius,
                      borderStyle: values.borderStyle,
                      borderWidth: values.borderWidth
                    }}
                  >
                    <Col>
                      <FormGroup>
                        <Label>Border Type!</Label>
                        <Field name="borderStyle" component="select">
                          <option value="solid">Solid</option>
                          <option value="groove">Groove</option>
                          <option value="ridge">Ridge</option>
                          <option value="inset">Inset</option>
                        </Field>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Border Color</Label>
                        <Field name="borderColor" type="color" />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Border Width</Label>
                        <Field name="borderWidth" component="select">
                          <option value="1px">1px</option>
                          <option value="2px">2px</option>
                          <option value="3px">3px</option>
                          <option value="5px">5px</option>
                        </Field>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Border Corners</Label>
                        <Field name="borderRadius" component="select">
                          <option value="0px">Straight</option>
                          <option value="8px">Semi-rounded</option>
                          <option value="15px">Rounded</option>
                          <option value="40px">Round</option>
                        </Field>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="pt-4">
                    <Col>
                      <FormGroup>
                        <Label>Font Family</Label>
                        <Field
                          className="border rounded boder-light"
                          name="fontFamily"
                          component="select"
                        >
                          <option
                            value="Source Sans Pro"
                            style={{ fontFamily: "Source Sans Pro" }}
                          >
                            Default
                          </option>
                          <option
                            value="Georgia, serif"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            Georgia
                          </option>
                          <option
                            value="Arial, Helvetica"
                            style={{ fontFamily: "Arial, Helvetica" }}
                          >
                            Arial
                          </option>
                          <option
                            value="Comic Sans MS"
                            style={{ fontFamily: "Comic Sans MS" }}
                          >
                            Comic Sans
                          </option>
                          <option
                            value="Courier New"
                            style={{ fontFamily: "Courier New" }}
                          >
                            Courier New
                          </option>
                        </Field>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Font Styling</Label>
                        <Field
                          className="border rounded boder-light"
                          name="fontStyle"
                          component="select"
                        >
                          <option
                            value="normal"
                            style={{ fontStyle: "normal" }}
                          >
                            Default
                          </option>
                          <option
                            value="italic"
                            style={{ fontFamily: "italic" }}
                          >
                            Italic
                          </option>
                          <option
                            value="oblique"
                            style={{ fontFamily: "oblique" }}
                          >
                            Oblique
                          </option>
                          <option value="bold" style={{ fontWeight: "bold" }}>
                            Bold
                          </option>
                          <option
                            value="lighter"
                            style={{ fontWeight: "lighter" }}
                          >
                            Lighter
                          </option>
                        </Field>
                      </FormGroup>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter className="px-1 py-0">
                  <Navbar
                    className="rounded pl-5"
                    style={{
                      marginLeft:
                        values.navMargin === "left" ||
                        values.navMargin === "center"
                          ? "auto"
                          : "",
                      marginRight:
                        values.navMargin === "right" ||
                        values.navMargin === "center"
                          ? "auto"
                          : "",
                      fontFamily: values.fontFamily,
                      fontWeight: values.fontWeight,
                      fontStyle: values.fontStyle,
                      backgroundColor: values.navColor
                    }}
                  >
                    <Nav>
                      <NavItem
                        style={{
                          backgroundColor: values.menuColor,
                          borderColor: values.borderColor,
                          borderWidth: values.borderWidth,
                          borderStyle: values.borderStyle,
                          borderRadius: values.borderRadius,
                          marginLeft: values.itemMargin,
                          marginRight: values.itemMargin
                        }}
                      >
                        <NavLink
                          style={{
                            color: values.color,
                            paddingLeft: values.padding,
                            paddingRight: values.padding
                          }}
                        >
                          Sample Item
                        </NavLink>
                      </NavItem>
                      <NavItem
                        style={{
                          backgroundColor: values.menuColor,
                          borderColor: values.borderColor,
                          borderWidth: values.borderWidth,
                          borderStyle: values.borderStyle,
                          borderRadius: values.borderRadius,
                          marginLeft: values.itemMargin,
                          marginRight: values.itemMargin
                        }}
                      >
                        <NavLink
                          style={{
                            color: values.color,
                            paddingLeft: values.padding,
                            paddingRight: values.padding
                          }}
                        >
                          Sample Item
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Navbar>
                </ModalFooter>

                <Button
                  className="mt-1"
                  block
                  type="submit"
                  color="primary"
                  onClick={props.toggleModal}
                >
                  Save
                </Button>
              </Form>
            </React.Fragment>
          );
        }}
      </Formik>
      <Button color="secondary" onClick={props.toggleModal}>
        Cancel
      </Button>
    </Modal>
  );
};

StylingModal.propTypes = {
  submitCall: PropTypes.func.isRequired,
  entityName: PropTypes.string,
  modalIsOpen: PropTypes.bool,
  toggleModal: PropTypes.func.isRequired,
  styleId: PropTypes.number,
  editStyles: PropTypes.object,

  touched: PropTypes.bool,
  values: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleBlur: PropTypes.func
};

export default React.memo(StylingModal);
