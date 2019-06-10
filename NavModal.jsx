import React from "react";
import {
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  ModalFooter,
  Button,
  FormGroup,
  Label
} from "reactstrap";
import { Formik, Form, Field } from "formik";
import PropTypes from "prop-types";

const NavModal = props => {
  const submitting = values => {
    if (!values.parentId) values.parentId = 0;

    values.RoleTypeId = props.roleTypeId;
    props.toggleModal();
    props.submitNav(values);
  };

  return (
    <Modal isOpen={props.modalIsOpen} toggle={props.toggleModal}>
      <ModalHeader className="bg-primary" toggle={props.toggleModal}>
        Edit Menu Items : <strong>{props.entityName}</strong>
      </ModalHeader>

      <Formik
        enableReinitialize={true}
        initialValues={props.editedItem}
        onSubmit={submitting}
      >
        {props => {
          const { values, handleSubmit, handleBlur } = props;
          return (
            <React.Fragment>
              <Form onSubmit={handleSubmit}>
                <ModalBody>
                  <Row>
                    <FormGroup className="col-4">
                      <Label>Link Name</Label>
                      <Field
                        onBlur={handleBlur}
                        className="form-control"
                        type="text"
                        name="name"
                        value={values.name}
                      />
                    </FormGroup>
                    <FormGroup className="col-8">
                      <Label>Link Url</Label>
                      <Field
                        className="form-control"
                        type="text"
                        name="link"
                        value={values.link}
                      />
                    </FormGroup>
                  </Row>
                  <Row>
                    <FormGroup className="col-4">
                      <Label>Sorting Order</Label>
                      <Field
                        className="form-control"
                        type="number"
                        name="sortOrder"
                        value={values.sortOrder}
                      />
                    </FormGroup>
                    <FormGroup className="col-4">
                      <Label>Parent Id</Label>
                      <Field
                        className="form-control"
                        type="number"
                        name="parentId"
                        value={values.parentId}
                      />
                    </FormGroup>
                  </Row>

                  <ModalFooter className="navFoot">
                    <FormGroup row>
                      <Label>Promoter/Vendor/Venue Id</Label>
                      <Field
                        readOnly
                        className="form-control"
                        type="number"
                        name="entityId"
                        value={values.entityId}
                      />
                    </FormGroup>
                    <FormGroup row>
                      <Label>Link Id</Label>
                      <Field
                        readOnly
                        className="form-control"
                        type="number"
                        name="id"
                        value={values.id}
                      />
                    </FormGroup>
                  </ModalFooter>
                </ModalBody>

                <Button className="mt-1" block type="submit" color="primary">
                  Save
                </Button>
              </Form>
            </React.Fragment>
          );
        }}
      </Formik>
      <Row>
        <Col hidden={!props.editedItem.entityId}>
          <Button
            block
            type="button"
            color="danger"
            onClick={() => {
              props.toggleModal();
              props.deleteItem(props.editedItem.id);
            }}
          >
            Delete
          </Button>
        </Col>
        <Col>
          <Button
            block
            type="button"
            color="secondary"
            onClick={props.toggleModal}
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

NavModal.propTypes = {
  roleTypeId: PropTypes.number,
  deleteItem: PropTypes.func.isRequired,
  entityName: PropTypes.string,
  modalIsOpen: PropTypes.bool,
  submitNav: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  editedItem: PropTypes.object,

  //formik values
  values: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleBlur: PropTypes.func
};

export default React.memo(NavModal);
