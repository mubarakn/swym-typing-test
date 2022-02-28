import ReactDOM from 'react-dom'
const Modal = ({ children }) => {

    return ReactDOM.createPortal(
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-50">
            {children}
        </div>
        ,document.getElementById('modal-root'))
}

export default Modal