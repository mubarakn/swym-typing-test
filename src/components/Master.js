
const Master = ({ children }) => {

    return (
        <div className="w-full h-full">
            <h1>Header</h1>
            {children}
            <footer>Footer</footer>
        </div>
    )
}

export default Master