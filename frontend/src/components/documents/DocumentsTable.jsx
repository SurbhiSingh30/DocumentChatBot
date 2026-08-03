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

function DocumentsTable(){

    return(

        <div className="documents-table">

            <div className="table-header">

                <span>Name</span>

                <span>Type</span>

                <span>Size</span>

                <span>Uploaded</span>

                <span>Actions</span>

            </div>

            {docs.map(doc=>(

                <div
                    className="table-row"
                    key={doc.name}
                >

                    <div className="doc-name">

                        <FileText size={20}/>

                        {doc.name}

                    </div>

                    <span>{doc.type}</span>

                    <span>{doc.size}</span>

                    <span>{doc.date}</span>

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