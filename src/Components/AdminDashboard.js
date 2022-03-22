import { useState } from "react";
import { useHistory, useLocation } from "react-router";
import AdminDash from "./AdminDash";
import ManageEmployees from "./ManageEmployees";
import ManageParkingSlots from "./ManageParkingSlots";

const AdminDashboard = () => {
    const location = useLocation();
    const history = useHistory();

    const user = location.state.user;
    var [currentComponent,setComponent] = useState("Dashboard");


    return ( 
        
        <div className="admin">
            <div className="header">
            <h1>{user.firstName}'s Dashboard</h1>
            <button id="logout-btn" onClick={() => history.push("/")}>Logout</button></div>

            <div className="select">
            <button onClick={_ => setComponent("Employees")}>Employees</button>
            <button onClick={_ => setComponent("ParkingSlots")}>Parking Slots</button>
            <button onClick={_ => setComponent("Dashboard")}>Dashboard</button>
            </div>
            {(currentComponent == "Employees") ? <ManageEmployees /> : (currentComponent == "ParkingSlots" ) ?  <ManageParkingSlots /> : <AdminDash />}
        <div className="footer"><p className="cps">Car Parking Solutions</p><p className="v">V ™</p> </div>
        </div>       
    );
}
 
export default AdminDashboard;