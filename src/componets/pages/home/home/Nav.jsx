import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaInfoCircle, FaEnvelope, FaTwitch } from "react-icons/fa";
import logo from '../../../../png/logo.png';
export default function Nav() {
    return (
        <div className="nav">
            <div className="nav-header">
                <img src={logo} alt="Logo"/>
            </div>
            <div className="nav-links">
                <ul>
                    <li><Link to="/"><FaHome /> Home</Link></li>
                    <li><Link to="/search"><FaSearch /> Search</Link></li>
                    <li><Link to="/about"><FaInfoCircle /> About</Link></li>
                    <li><Link to="/contact"><FaEnvelope /> Contact</Link></li>
                    <li><a href="https://www.twitch.tv/" target="_blank" rel="noopener noreferrer"><FaTwitch /> Twitch</a></li>
                </ul>
            </div>
            <div className="nav-footer">
                <button> Join for free or log in</button>
                <p>&copy; 2025 QuestLog. All rights reserved.</p>
            </div>
        </div>
    )
}