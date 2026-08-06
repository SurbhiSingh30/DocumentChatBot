import {
    FileText,
    Eye,
    Download,
    Trash2
} from "lucide-react";

const docs = [

    {
        name:"Research.pdf",
        type:"PDF",
        size:"2.4 MB",
        date:"Today"
    },

    {
        name:"Resume.pdf",
        type:"PDF",
        size:"480 KB",
        date:"Yesterday"
    },

    {
        name:"TTL_Project.docx",
        type:"DOCX",
        size:"1.1 MB",
        date:"3 days ago"
    }

];

function DocumentsTable({ documents }) {

    return(

        <div className="documents-table">
        

            <div className="table-header">

                <span>Name</span>

                <span>Type</span>

                <span>Size</span>

                <span>Uploaded</span>

                <span>Actions</span>

            </div>

            {documents.map((doc) => (

                <div
                    className="table-row"
                    key={doc.filename}
                >

                    <div className="doc-name">

                        <FileText size={20}/>

                        {doc.filename}

                    </div>

                    <span>{doc.file_type}</span>

                    <span>{doc.file_size}</span>

                    <span>{doc.updated_to}</span>

                    <div className="actions">

                        <Eye size={18}/>

                        <Download size={18}/>

                        <Trash2 size={18}/>

                    </div>

                </div>

            ))}

        </div>

    );

}

export default DocumentsTable;