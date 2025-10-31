import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import './GlobalToasts.css';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', title = '', duration = 5000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, title, duration }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const toast = {
        success: (message, title = 'Успіх!', duration = 5000) => addToast(message, 'success', title, duration),
        error: (message, title = 'Помилка!', duration = 7000) => addToast(message, 'error', title, duration),
        warning: (message, title = 'Увага!', duration = 5000) => addToast(message, 'warning', title, duration),
        info: (message, title = 'Інформація', duration = 4000) => addToast(message, 'info', title, duration),
        remove: removeToast
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div id="toastsContainerTopRight" className="toasts-top-right fixed">
                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        {...toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ message, type, title, duration = 5000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const getIcon = () => {
        switch (type) {
            case 'success': return 'fas fa-check-circle';
            case 'error': return 'fas fa-exclamation-circle';
            case 'warning': return 'fas fa-exclamation-triangle';
            case 'info': default: return 'fas fa-info-circle';
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success': return 'bg-success';
            case 'error': return 'bg-danger';
            case 'warning': return 'bg-warning';
            case 'info': default: return 'bg-info';
        }
    };

    const getTimeAgo = () => {
        // Можна додати час створення, але для простоти використовуємо "just now"
        return '';
    };

    return (
        <div className={`toast ${getBgColor()} fade show`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
                <i className={`${getIcon()} mr-2`}></i>
                <strong className="mr-auto">{title}</strong>
                <small className="ml-2">{getTimeAgo()}</small>
                <button
                    type="button"
                    className="ml-2 mb-1 close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div className="toast-body">{message}</div>
        </div>
    );
};

export default ToastProvider;