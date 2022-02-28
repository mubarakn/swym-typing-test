
const Modal = ({ children }) => {

    return (
        <div className="absolute w-full h-full flex items-center justify-center bg-gray-50">
            {children}
        </div>
    )
}

export default Modal