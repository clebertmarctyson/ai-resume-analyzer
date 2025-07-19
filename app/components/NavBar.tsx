import React from 'react'
import {Link} from "react-router";

const NavBar = () => {
    return (
        <nav className="navbar">
            <Link  to="/">
                <p className="text-2xl text-gradient font-bold">Resumind</p>
            </Link>

            <Link className="primary-button w-fit" to="/upload">Upload Resume</Link>
        </nav>
    )
}
export default NavBar
