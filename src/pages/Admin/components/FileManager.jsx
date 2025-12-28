import React, { useEffect, useState } from "react";
import API_URL_BACKEND from "../../../config";
import "./FileManager.css";

const FileManager = ({ onSelectFile }) => {
    const [folders, setFolders] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [subfolders, setSubfolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editingValue, setEditingValue] = useState("");
    const [newFolderName, setNewFolderName] = useState("");
    const [uploading, setUploading] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState({}); // <--- новий стан

    const headers = (json = true) => {
        const h = {};
        const token = localStorage.getItem("authToken");
        if (json) h["Content-Type"] = "application/json";
        if (token) h["Authorization"] = `Bearer ${token}`;
        return h;
    };

    const loadFolders = async () => {
        const res = await fetch(`${API_URL_BACKEND}/folders`, { headers: headers() });
        setFolders(await res.json());
    };

    const loadFolderContent = async (id) => {
        setCurrentFolderId(id);
        setSelectedItem(null);

        const [rf, rfi] = await Promise.all([
            fetch(id === null ? `${API_URL_BACKEND}/folders/root` : `${API_URL_BACKEND}/folders/parent/${id}`, { headers: headers() }),
            fetch(id === null ? `${API_URL_BACKEND}/files` : `${API_URL_BACKEND}/files?folderId=${id}`, { headers: headers() }),
        ]);

        setSubfolders(await rf.json());
        setFiles(await rfi.json());

        if (window.innerWidth < 768) setShowSidebar(false);
    };

    const toggleExpand = (id) => {
        setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const uploadFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const form = new FormData();
        form.append("file", file);
        if (currentFolderId) form.append("folderId", currentFolderId);
        setUploading(true);
        await fetch(`${API_URL_BACKEND}/files/upload`, { method: "POST", headers: { Authorization: headers(false).Authorization }, body: form });
        setUploading(false);
        loadFolderContent(currentFolderId);
    };

    const deleteItem = async (item) => {
        await fetch(`${API_URL_BACKEND}/${item.isFolder ? "folders" : "files"}/${item.id}`, { method: "DELETE", headers: headers() });
        loadFolders();
        loadFolderContent(currentFolderId);
    };

    const createFolder = async () => {
        if (!newFolderName.trim()) return;
        await fetch(`${API_URL_BACKEND}/folders?name=${encodeURIComponent(newFolderName)}&parentId=${currentFolderId ?? ""}`, { method: "POST", headers: headers(false) });
        setNewFolderName("");
        loadFolders();
        loadFolderContent(currentFolderId);
    };

    const startEditing = () => {
        if (!selectedItem) return;
        setEditingId(selectedItem.id);
        setEditingValue(selectedItem.name);
    };

    const finishEditing = async () => {
        if (!editingId || !editingValue.trim()) return;
        const type = selectedItem.isFolder ? "folders" : "files";
        await fetch(`${API_URL_BACKEND}/${type}/${editingId}/rename?newName=${encodeURIComponent(editingValue)}`, { method: "PUT", headers: headers() });
        setEditingId(null);
        setEditingValue("");
        loadFolders();
        loadFolderContent(currentFolderId);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") finishEditing();
        if (e.key === "Escape") { setEditingId(null); setEditingValue(""); }
    };

    const downloadFile = (file) => {
        const token = localStorage.getItem("authToken");
        window.open(`${API_URL_BACKEND}/files/${file.id}/download?token=${token}`, "_blank");
    };

    const getBreadcrumbs = () => {
        const path = [];
        let current = folders.find(f => f.id === currentFolderId);
        while (current) {
            path.unshift(current);
            if (!current.parentId) break;
            current = folders.find(f => f.id === current.parentId);
        }
        return path;
    };

    const renderTree = (nodes, parentId = null) =>
        nodes
            .filter(n => n.parentId === parentId)
            .map(n => {
                const hasChildren = nodes.some(c => c.parentId === n.id);
                return (
                    <li key={n.id}>
                        <div className="d-flex align-items-center">
                            <i
                                className={`fa-solid fa-chevron-${expandedFolders[n.id] ? "down" : "right"} me-1`}
                                onClick={() => nodes.some(c => c.parentId === n.id) && toggleExpand(n.id)}
                                style={{
                                    cursor: nodes.some(c => c.parentId === n.id) ? "pointer" : "default",
                                    opacity: nodes.some(c => c.parentId === n.id) ? 1 : 0.2, // напівпрозора якщо немає дітей
                                    width: "12px"
                                }}
                            ></i>
                            <span
                                className="fm-tree-item"
                                style={{ fontWeight: currentFolderId === n.id ? "bold" : "normal", cursor: "pointer" }}
                                onClick={() => setSelectedItem({ ...n, isFolder: true })}
                                onDoubleClick={() => loadFolderContent(n.id)}
                            >
                              <i className="fa-solid fa-folder text-warning me-1"></i>
                                <span title={n.name}>{n.name.length > 20 ? n.name.slice(0, 20) + "…" : n.name}</span>

                            </span>
                        </div>
                        {expandedFolders[n.id] && <ul style={{ paddingLeft: "20px", listStyle: "none" }}>{renderTree(nodes, n.id)}</ul>}
                    </li>
                );
            });


    useEffect(() => { loadFolders(); loadFolderContent(null); }, []);

    return (
        <div className="file-manager d-flex position-relative">

            <div className={`fm-sidebar ${showSidebar ? "show" : ""}`}>
                <h6>Папки</h6>
                <ul className="fm-tree" >
                    <li>
                        <span
                            className="fm-tree-item"
                            onClick={() => { setSelectedItem({ id: null, isFolder: true }); if (window.innerWidth < 768) setShowSidebar(false); }}
                            onDoubleClick={() => loadFolderContent(null)}
                            style={{ fontWeight: currentFolderId === null ? "bold" : "normal" }}
                        >
                          <i className="fa-solid fa-house text-warning"></i> Root
                        </span>
                        <ul style={{ paddingLeft: "20px", listStyle: "none" }}>{renderTree(folders, null)}</ul>
                    </li>
                </ul>
            </div>

            <div className="fm-content d-flex flex-column flex-fill">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-2">
                        <li className={`breadcrumb-item ${currentFolderId === null ? "active" : ""}`} onClick={() => loadFolderContent(null)} style={{ cursor: "pointer" }}>Root</li>
                        {getBreadcrumbs().map(f => (
                            <li key={f.id} className={`breadcrumb-item ${currentFolderId === f.id ? "active" : ""}`} style={{ cursor: "pointer" }} onClick={() => loadFolderContent(f.id)}>
                                <span title={f.name}>{f.name.length > 20 ? f.name.slice(0, 20) + "…" : f.name}</span>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="fm-toolbar mb-2 d-flex align-items-center">
                    <button className="btn btn-sm btn-outline-secondary d-md-none me-2" onClick={() => setShowSidebar(!showSidebar)}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <label className="btn btn-sm btn-success mb-0 me-2">
                        <i className="fa-solid fa-upload"></i>
                        <input hidden type="file" onChange={uploadFile} />
                    </label>
                    <button className="btn btn-sm btn-outline-primary mb-0 me-2" disabled={!selectedItem} onClick={startEditing}>
                        <i className="fa-solid fa-pen"></i>
                    </button>
                </div>

                <div className="p-2 border-bottom d-flex mb-2">
                    <input type="text" className="form-control me-2" placeholder="Назва нової папки" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
                    <button className="btn btn-primary flex-shrink-0" onClick={createFolder}><i className="fa-solid fa-folder-plus"></i> Створити папку</button>
                </div>

                <div className="flex-fill overflow-auto p-2">
                    <table className="table table-sm table-hover mb-0">
                        <thead>
                        <tr>
                            <th>Назва</th>
                            <th>Розмір</th>
                            <th>Тип</th>
                            <th>Дата</th>
                            <th>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Підпапки */}
                        {subfolders.map(f => (
                            <tr
                                key={`folder-${f.id}`}
                                className={selectedItem?.id === f.id && selectedItem?.isFolder ? "table-primary" : ""}
                                onClick={() => setSelectedItem({ ...f, isFolder: true })}
                                onDoubleClick={() => loadFolderContent(f.id)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>
                                    <i className="fa-solid fa-folder text-warning"></i>{" "}
                                    {editingId === f.id ? (
                                        <input
                                            type="text"
                                            value={editingValue}
                                            autoFocus
                                            onChange={e => setEditingValue(e.target.value)}
                                            onBlur={finishEditing}
                                            onKeyDown={handleKeyDown}
                                            style={{ width: "80%" }}
                                        />
                                    ) : (
                                        <span title={f.name}>{f.name.length > 20 ? f.name.slice(0, 20) + "…" : f.name}</span>
                                    )}
                                </td>
                                <td>-</td>
                                <td>folder</td>
                                <td>{new Date(f.createdAt).toLocaleString()}</td>
                                <td>
                                    <i
                                        className="fa-solid fa-trash text-danger"
                                        onClick={e => { e.stopPropagation(); deleteItem({ ...f, isFolder: true }); }}
                                        style={{ cursor: "pointer" }}
                                    />
                                </td>
                            </tr>
                        ))}

                        {/* Файли */}
                        {files.map(f => (
                            <tr
                                key={`file-${f.id}`}
                                className={selectedItem?.id === f.id && !selectedItem?.isFolder ? "table-primary" : ""}
                                onClick={() => setSelectedItem({ ...f, isFolder: false })}
                                style={{ cursor: "pointer" }}
                            >
                                <td>
                                    <i className="fa-solid fa-file"></i>
                                    <span title={f.name}>{f.name.length > 20 ? f.name.slice(0, 20) + "…" : f.name}</span>
                                </td>
                                <td>{(f.size / 1024).toFixed(1)} KB</td>
                                <td>{f.contentType}</td>
                                <td>{new Date(f.createdAt).toLocaleString()}</td>
                                <td>
                                    <i
                                        className="fa-solid fa-download text-success me-2"
                                        onClick={e => { e.stopPropagation(); downloadFile(f); }}
                                        style={{ cursor: "pointer" }}
                                    />
                                    <i
                                        className="fa-solid fa-trash text-danger"
                                        onClick={e => { e.stopPropagation(); deleteItem({ ...f, isFolder: false }); }}
                                        style={{ cursor: "pointer" }}
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {uploading && <div className="text-center p-2">Завантаження… 🌀</div>}
                </div>

                <div className="p-2 border-top text-end">
                    <button className="btn btn-primary" disabled={!selectedItem || selectedItem.isFolder} onClick={() => onSelectFile?.(selectedItem)}>Вибрати файл</button>
                </div>
            </div>
        </div>
    );
};

export default FileManager;
