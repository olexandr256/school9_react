import React from "react";
import FileManager from "../components/FileManager";
import API_URL_BACKEND from "../../../config";

const FileManagerPage = () => {
    const handleSelectFile = (file) => {
        console.log("Обраний файл:", file);
        // тут можна передати файл в модалку для публікації
    };

    return (
        <div className="container mt-3">
            <h3>Файловий менеджер</h3>
            <FileManager apiUrl={`${API_URL_BACKEND}/files`} onSelectFile={handleSelectFile} />
        </div>
    );
};

export default FileManagerPage;
