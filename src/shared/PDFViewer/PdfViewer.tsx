import { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import './PdfViewer.css';


interface PdfViewerModalProps {
    showModal: boolean;
    setShowModal: (type: boolean) => void;
    srcLink?:any;
}


const PdfViewer = ({showModal,srcLink, setShowModal}:PdfViewerModalProps) => {

  const [pdfViewerVisible, setPdfViewerVisible] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);


  const showPDF = () => {
      if (iframeRef.current) {
          iframeRef.current.src = `${srcLink}&toolbar=0`;
      }
      setPdfViewerVisible(true);
  };

  useEffect(() => {
      if (srcLink) {
          showPDF();
      }
  }, [srcLink]);

  useEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe) {
           return; //Prevent execution if iframe is not yet present.
      }
      const handleRightClick = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
      };


      const onLoad = () => {
            try {
               if (iframe.contentDocument) {
                  iframe.contentDocument.addEventListener('contextmenu', handleRightClick);
                 return;
                }

                if (iframe.contentWindow) {
                   iframe.contentWindow.addEventListener('contextmenu', handleRightClick);
                  return;
                }
            } catch (error) {
                  console.error('Error accessing iframe content for disabling contextmenu', error)
            }

      };

      iframe.addEventListener('load', onLoad);


      return () => {
         if (iframe.contentDocument) {
               iframe.contentDocument.removeEventListener('contextmenu', handleRightClick);
               return;
         }

         if (iframe.contentWindow) {
              iframe.contentWindow.removeEventListener('contextmenu', handleRightClick)
               return;
           }

          iframe.removeEventListener('load', onLoad);
      };

  }, [pdfViewerVisible, srcLink]);

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <div className='pdf-vierwr'>
          <iframe
          ref={iframeRef}
          id="pdf-iframe"
            src={`${srcLink}#toolbar=0`}
            width="100%"
            height="450px"
            title="PDF Viewer"
            style={{ border: '1px solid #ccc', pointerEvents: 'none' }}
          ></iframe>
          </div> */}

<div
                    onContextMenu={(e) => e.preventDefault()}
                    onDoubleClick={(e) => e.preventDefault()}
                >
                    <div
                        id="pdf-viewer"
                        style={{ display: pdfViewerVisible ? 'block' : 'none' }}
                    >
                        <iframe id="pdf-iframe" ref={iframeRef} />
                        <div
                            id="overlay"
                            ref={overlayRef}
                            onContextMenu={(e) => e.preventDefault()}
                            onDoubleClick={(e) => e.preventDefault()}
                        />
                    </div>
                </div>
           
        </Modal.Body>
      </Modal>
    )
}

export  default PdfViewer;