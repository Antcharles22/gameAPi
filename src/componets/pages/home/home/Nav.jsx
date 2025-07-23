import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaInfoCircle, FaEnvelope, FaTwitch } from "react-icons/fa";

export default function Nav() {
    return (
        <div className="nav">
            <h1>QuestLog</h1>
            <div className="nav-links">
                <ul>
                    <li><Link to="/"><FaHome /> Home</Link></li>
                    <li><Link to="/search"><FaSearch /> Search</Link></li>
                    <li><Link to="/about"><FaInfoCircle /> About</Link></li>
                    <li><Link to="/contact"><FaEnvelope /> Contact</Link></li>
                    <li><Link to="/twitch"><FaTwitch /> Twitch</Link></li>
                </ul>
            </div>
        </div>
    )
}