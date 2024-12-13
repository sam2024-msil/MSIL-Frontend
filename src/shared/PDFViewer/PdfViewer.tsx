import { Modal } from 'react-bootstrap';


interface PdfViewerModalProps {
    showModal: boolean;
    setShowModal: (type: boolean) => void;
    srcLink?:string;
}

const PdfViewer = ({showModal,srcLink, setShowModal}:PdfViewerModalProps) => {

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={`${srcLink}#toolbar=0`}
            width="100%"
            height="450px"
            title="PDF Viewer"
          ></iframe>
        </Modal.Body>
      </Modal>
    )
}

export  default PdfViewer;