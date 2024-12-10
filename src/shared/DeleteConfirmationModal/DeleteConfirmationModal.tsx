import { Modal, Button } from 'react-bootstrap';
import styles from './DeleteConfirmModal.module.scss';


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
                </Modal.Body>
                <Modal.Footer className={styles['footer']}>
                    <div className={styles['button-group']}>

                        <Button variant="light" className={styles.cancelBtn} onClick={() => onClose('cancel')}>No</Button>{' '}
                        <Button
                            variant="danger"
                            className={styles.addBtn}
                            onClick={() => onClose('proceed')}
                        >
                            Yes
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
      );
}

export default DeleteConfimationModal;