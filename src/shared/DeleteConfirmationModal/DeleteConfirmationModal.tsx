import { Modal, Button } from 'react-bootstrap';


interface DeleteConfirmModalProps {
    show: boolean;
    onClose: (type: string) => void;
    msg?:string;
}

const DeleteConfimationModal = ({ show, onClose, msg }: DeleteConfirmModalProps) => {

    return (
        <Modal
                animation={false}
                show={show}
                onHide={() => onClose('cancel')}
                backdrop={"static"}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {(msg) ? msg : 'Are you sure you want to delete this item?' }

                    <div className="text-end">
                        <button type="button" className='mt-3 me-2 btn btn-outline-primary' onClick={() => onClose('cancel')}>
                            No
                        </button>
                        <Button variant="danger" type='submit' className='mt-3' onClick={() => onClose('proceed')}>
                            Yes
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
      );
}

export default DeleteConfimationModal;