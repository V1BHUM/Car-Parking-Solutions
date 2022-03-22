import axios from "axios";
import { useEffect, useState } from "react";
import LocationItem from "./LocationItem";
import SlotItem from "./SlotItem";
import PreferenceList from "../Others/PreferenceList";

const ManageParkingSlots = () => {

    const [location,setLocation] = useState();
    const [dryWash,setDryWash] = useState(false);
    const [carWash,setCarWash] = useState(false);
    const [repairs,setRepairs] = useState(false);

    const [preference,setPreference] = useState(PreferenceList.list[0]);

    const [locationId,setLocationId] = useState();

    const [slots,setSlots] = useState();
    const [foundSlots,setFoundSlots] = useState(false);
    const [spaces,setSpaces] = useState();
    const [foundSpaces,setFoundSpaces] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:8080/slots/all").then((res) => {console.log(res.data); setSlots(res.data);  setFoundSlots(true);});
        axios.get("http://localhost:8080/location/all").then((res) =>{ setSpaces(res.data); setFoundSpaces(true)});
    },[])

    const postLocation = () => {
        axios.post("http://localhost:8080/location/add",null,{params:{
            location:location,
            offeredDryWash:dryWash,
            offeredCarWash:carWash,
            offeredRepairs:repairs,
        }}).then((res) => console.log(res));
    }

    const postSlot = () => {
        
        let parkingLoc;
        if(preference != PreferenceList.list[0])
        {
           axios.get("http://localhost:8080/location/get",{params:{
                id:locationId
            }}).then((res) => {
                parkingLoc = res.data.location;
                setTimeout(() => axios.post("http://localhost:8080/slots/add",null,{params:{
                    locationId:locationId,
                    locationName:parkingLoc,
                    preference:preference
                }}),10);

            }); 
        }
        

        
    }

    let slotNumber = 1;
    return ( 
        <div className="ManageParkingSlots">
            
            <h2> Add Location </h2>
            <div id = "unique_enclosure">
            <input id="parking-location" placeholder="Location" onChange={(e) => setLocation(e.target.value)} />
            <input type="checkbox" id="dryWash-chkbox" onChange={(e) => setDryWash(e.target.value)} />
            <label htmlFor="dryWash-chkbox">Dry Cleaning</label>
            <input type="checkbox" id="carWash-chkbox" onChange={(e) => setCarWash(e.target.value)} />
            <label htmlFor="carWash-chkbox">Car Wash</label>
            <input type="checkbox" id="repairs-chkbox" onChange={(e) => setRepairs(e.target.value)} />
            <label htmlFor="repairs-chkbox">Repairs</label>
            <button onClick={postLocation}>Post</button>
            </div>
            <div id="loc_enc">
            <h3>Locations</h3>
            <ul id="all-admin-locations">{foundSpaces && (spaces.map((loc) => <LocationItem location={JSON.stringify(loc)} user={null} admin={true} />))}</ul>
            </div>
            <hr class="rounded"></hr>
            
            <br></br>
            <h2>Add Slot</h2>
            <div id="manage_slot_unique_div">
            <input id="slot-locationId" placeholder="Location ID" onChange={(e) => setLocationId(e.target.value)} />
                <select defaultValue={PreferenceList.list[0]} onChange={(e) => {setPreference(e.target.value); console.log(e.target.value)}}>
                    {PreferenceList.list.map((pref) => <option value={pref}>{pref}</option>)}
                </select>
            <button onClick={postSlot} >Post Slot </button>
            </div>
            <div id="slot_enc">
            <h3>Slots</h3>
            <ul>{foundSlots && (slots.map((o) => <SlotItem slot={o} user={null} admin={true} slotNumber={slotNumber++}  />))}</ul>
            </div>
        </div>
     );
}
 
export default ManageParkingSlots;
