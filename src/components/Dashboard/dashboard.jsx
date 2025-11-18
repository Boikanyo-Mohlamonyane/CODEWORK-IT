import React, { useState } from "react";
import { FiFolder, FiChevronDown, FiChevronRight, FiMenu, FiHome, FiBook } from "react-icons/fi";
import { BsPlusLg } from "react-icons/bs";
import "../../css/dashboard.css";

function Dashboard() {
    const initialTests = [
        { id: "001", name: "Sign Up and Login", status: "Ready", type: "Automated", tester: "Jane Doe" },
        { id: "002", name: "Delete Users", status: "Done", type: "Automated", tester: "John Doe" },
        { id: "003", name: "Password Reset", status: "In Progress", type: "Automated", tester: "Alex Max" },
        { id: "004", name: "Add Users", status: "Done", type: "Automated", tester: "Jane Doe" },
        { id: "005", name: "User Authentication", status: "Ready", type: "Automated", tester: "Jane Doe" },
    ];


    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [testsState, setTestsState] = useState(initialTests);


    const projects = ["Project 001", "Project 002", "Project 003", "Project 004"]; 

    const menuItems = [
        { label: "Main Menu", icon: <FiHome /> },
        { label: "Test Library", icon: <FiBook /> }
    ];

    const filteredTests = testsState.filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.includes(searchTerm)
    );

    const toggleCheck = (id) => {
        setTestsState(prev =>
            prev.map(row =>
            row.id === id ? { ...row, checked: !row.checked } : row
            )
        );
    };
  
    return (
    <div className="app-container">

      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <FiMenu className="menu-icon" onClick={() => setSidebarOpen(!sidebarOpen)} />

          {sidebarOpen && (
            <div className="project-section">
              <div className="project-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FiFolder />
                <span>Projects</span>
                {dropdownOpen ? <FiChevronDown /> : <FiChevronRight />}
              </div>

              {dropdownOpen && (
                <div className="dropdown-list">
                  {projects.map((p) => (
                    <div className="dropdown-item" key={p}>{p}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="sidebar-items">
          {menuItems.map((item) => (
            <div key={item.label} className="menu-item">
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by test name/id"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <div className="table-header">
            <h2>Test Library</h2>
            <button className="new-test-btn"><BsPlusLg /> New Test</button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th className="wide-col">Name</th>
                <th>Status</th>
                <th>Type</th>
                <th>Tester</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((t) => (
                <tr key={t.id} className={t.checked ? "checked-row" : ""}>
                    <td>
                        <input 
                            type="checkbox" 
                            checked={t.checked || false}
                            onChange={() => toggleCheck(t.id)}
                        />
                    </td>
                  <td>{t.id}</td>
                  <td className="wide-col">{t.name}</td>
                  <td>{t.status}</td>
                  <td>{t.type}</td>
                  <td>{t.tester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default Dashboard