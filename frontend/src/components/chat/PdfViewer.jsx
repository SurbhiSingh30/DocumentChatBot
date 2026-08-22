import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

function PdfViewer({
    documentUrl,
    selectedPage,
}) {
    const [numPages, setNumPages] = useState(null);

    useEffect(() => {
        if (selectedPage) {
            setTimeout(() => {
                const pageElement = document.getElementById(
                    `pdf-page-${selectedPage}`
                );

                pageElement?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 100);
        }
    }, [selectedPage]);

    if (!documentUrl) {
        return (
            <div className="document-empty">
                No document selected
            </div>
        );
    }

    return (
        <div className="pdf-react-viewer">
            <Document
                file={documentUrl}
                onLoadSuccess={({ numPages }) =>
                    setNumPages(numPages)
                }
                loading="Loading document..."
            >
                {Array.from(
                    new Array(numPages || 0),
                    (_, index) => (
                        <div
                            key={index + 1}
                            id={`pdf-page-${index + 1}`}
                            className="pdf-page-wrapper"
                        >
                            <Page
                                pageNumber={index + 1}
                                width={700}
                                renderTextLayer
                                renderAnnotationLayer
                            />
                        </div>
                    )
                )}
            </Document>
        </div>
    );
}

export default PdfViewer;