import React from "react";
import { Button, Modal } from "react-bootstrap";

function DeleteProductModal(props) {

  const deleteHandler = async () => {
    props.onDeleteUser(props.id);
    props.onHide();
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.header}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{props.bodyHeader}</h4>
        <p className="mt-3">
          NAME: {props.name}
        </p>
        <p>
          PRICE: {props.price}
        </p>
        <p>
          CATEGORY: {props.category}
        </p>
        <p>
          BRAND: {props.brand}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={deleteHandler}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteProductModal;