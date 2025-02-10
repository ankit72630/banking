export const DocumentFileUpload = (props: any) => {
    return (
      <>
        <div className="document-upload__file-upload__upload-section">
          <div className="documentavatar">
            <span></span>
          </div>
          <div className="document-details">
            <span className="document-title">
              {props.documentHeaders(props.docType.document_type)}
            </span>
            <span className="document-description">
              {props.documentHeaders(props.docType.selectDocument)}
            </span>
          </div>
          <input
            type="file"
            name="file"
            onChange={(event) => {
              props.changeHandler(
                props.uploadingDocument,
                props.documentTypes,
                event,
                props.index
              );
            }}
            accept=".pdf,.jpeg,.jpg,.png,.PNG"
            id={
              "upload-photo__" +
              props.documentTypes.document_category +
              "_" +
              props.index
            }
            className="document-upload__file-upload__hide-upload"
          />
          <label
            className="upload-icon"
            htmlFor={
              "upload-photo__" +
              props.documentTypes.document_category +
              "_" +
              props.index
            }
          >
            <span></span>
          </label>
        </div>
      </>
    );
  };
  
  export default DocumentFileUpload;
