import axios from "axios";
import { useHistory, useLocation } from "react-router";
import PreferenceList from "../Others/PreferenceList";

const EditDetails = () => {
    const location = useLocation().state;
    const history = useHistory();
    const user = location.user;

    const editDetails = () => {

        const mobileNumberPattern = /[0-9]{10}/;
        const zipCodePattern = /[0-9]{6}/;
        const numberPlatePattern = /[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}/;

        if(!mobileNumberPattern.test(user.phoneNumber))
        {
            alert("Please enter a valid mobile number");
        }
        else if(!zipCodePattern.test(user.zipCode))
        {
            alert("Please enter a valid zip code");
        }
        else if(!numberPlatePattern.test(user.carNumber))
        {
            alert("Please enter a valid number plate");
        }
        else if(user.carModel == PreferenceList.list[0] || user.carModel == null)
        {
            alert("Please choose a car model");
        }
        else
        {
            axios.post("http://localhost:8080/users/update",null,{params:{
                id:user.id,
                carModel:user.carModel,
                carNumber: user.carNumber,
                firstName:user.firstName,
                lastName:user.lastName,
                phoneNumber:user.phoneNumber,
                address:user.address,
                zipCode:user.zipCode
            }}).then(res => {
                console.log(res.data);
                if(res.data == "Saved")
                {
                    history.push("/dashboard",{user:user});
                }
            });
        }

        
    }


    return ( 
        <div className="edit-details">
            <h2>Add/Edit Details</h2>
            <br />
            <div id="first-name">
                <label htmlFor="first-name-input">First Name</label>
                <input id="first-name-input" placeholder="First Name" defaultValue={user.firstName} onChange={(e) => user.firstName=e.target.value} />
            </div>
            <br />
            <div id="last-name">
                <label htmlFor="last-name-input"> Last Name</label>
                <input id="last-name-input" placeholder="Last Name" defaultValue={user.lastName} onChange={(e) => user.lastName=e.target.value} />
            </div>
            <br />
            <div id="mobile-number">
                <label htmlFor="mobile-number-input">Mobile Number</label>
                <input id="mobile-number-input" placeholder="Mobile Number" defaultValue={user.phoneNumber} onChange={(e) => user.phoneNumber=e.target.value} />
            </div>
            <br />
            <div id="address-field">
                <label htmlFor="address-input"> Address</label>
                <input id="address-input" placeholder="Address" defaultValue={user.address} onChange={(e) => user.address=e.target.value} />
            </div>
            <br />
            <div id="zip-code">
                <label htmlFor="zip-code-input">Zip Code</label>
                <input id="zip-code-input" placeholder="Zip Code" defaultValue={user.zipCode} onChange={(e) => user.zipCode=e.target.value} />
            </div>
            <br />
            <div id="car-model">
                <label htmlFor="car-model-input" >Car Model </label>
                <select defaultValue={(user.carModel == null) ? PreferenceList.list[0] : user.carModel} onChange={(e) => {user.carModel = e.target.value}}>
                    {PreferenceList.list.map((pref) => <option value={pref}>{pref}</option>)}
                </select>
            </div>
            <br />
            <div id="car-number">
                <label htmlFor="car-number-input">Car Number Plate</label>
                <input id="car-number-input" placeholder="Car Number Plate" defaultValue={user.carNumber} onChange={e => user.carNumber=e.target.value} />
            </div>
            <br />
            <button id="edit-button" onClick={editDetails}>Edit</button>
        </div>
     );
}
 
export default EditDetails;
