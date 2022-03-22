import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import MessagingService from "../Others/MessagingService";


const BookSlot = () => {
    const params = useParams();
    const location = useLocation();
    const user = location.state.user;
    const history = useHistory();

    let userId = user.id;
    var slotId = params.id;
    const [checkInTime,setCheckInTime] = useState("");
    const [checkOutTime,setCheckOutTime] = useState("");
    const [bookingDate,setBookingDate] = useState("");

    const [dryWash,setDryWash] = useState(false);
    const [carWash,setCarWash] = useState(false);
    const [repairs,setRepairs] = useState(false);

    const [loc,setLoc] = useState();
    const [locFound,setLocFound] = useState(false);
    
    let [slot,setSlot] = useState();
    const slotid = slotId;
    
    useEffect(_ => {
        axios.get("http://localhost:8080/slots/get",{params:{
            id:slotId
        }}).then((res) => {
            setSlot(res.data);
            axios.get("http://localhost:8080/location/get",{params:{
                id: res.data.locationId
            }}).then(res => {
                setLoc(res.data);
                setLocFound(true);
            })
        })
    },[]);

    const calculatePayment = (chkInTime,chkOutTime) => {
        let amount = 100;
        let hours = chkOutTime[0] - chkInTime[0];
        let min = chkOutTime[1] - chkInTime[1];
        console.log(chkOutTime[1] - chkOutTime[1]);
        if(min < 0)
        {
            min += 60;
            hours--;
        }
        console.log("Hours: " + hours + " Min: " + min);
        amount += hours*25;
        amount += min/60*25;

        if(dryWash) amount += 100;
        if(carWash) amount += 250;
        if(repairs) amount += 300;

        return Math.round(amount);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const datePattern = /[0-9]{2}-[0-9]{2}-[0-9]{2}/
        const checkTimePattern = /[0-9]{2}:[0-9]{2}/

        if(!datePattern.test(bookingDate))
        {
            alert("Enter the date in specified format");
        }
        else if(!checkTimePattern.test(checkInTime))
        {
            alert("Invalid check in time entered! Please enter in the specified format");
        }
        else if(!checkTimePattern.test(checkOutTime))
        {
            alert("Invalid check out time entered! Please enter in the specified format");
        }
        else
        {
            var chkInTime = checkInTime.split(':');
            var chkOutTime = checkOutTime.split(':');
            if(chkOutTime[0] - chkInTime[0] < 0)
            {
                alert("You cannot check out before you check in. Please enter a valid check in and check out times");
            }
            else
            {
                console.log("Check In Time : "+chkInTime[0] + ":" + chkInTime[1]);
                console.log("Slot id:" + slotId);
                axios.post("http://localhost:8080/orders/new",null,{params:{
                    locationId: slot.locationId,
                    bookedBy:userId,
                    slotId:slotid,
                    wantDryWash:dryWash,
                    wantCarWash:carWash,
                    wantRepairs:repairs,
                    checkInTime:checkInTime,
                    checkOutTime:checkOutTime,
                    bookingDate:bookingDate,
                    amount:calculatePayment(chkInTime,chkOutTime),
                }}).then(res => {
                    MessagingService.sendConfirmationMail(user,res.data);

                    axios.post("http://localhost:8080/slots/setBooked", null, {params:{
                        id:slotId
                    }}).then(res => history.push("/dashboard",{user:user}));
                });
            }
        }


        
    }

    return ( 
        <div className="other-container-fluid">
            <h2>Slot Booking</h2>
            <p>Booking Cost : Rs. 25/hr</p>
            <label htmlFor="booking-date">Booking Date </label>
            <input id="booking-date" placeholder="DD-MM-YY"
            onChange={(e) => setBookingDate(e.target.value)} />
            <br /><br />
            <label htmlFor="check-in-time">Check In Time </label>
            <input id="check-in-time" placeholder="HH:MM"
            value={checkInTime}
            onChange={(e) => setCheckInTime(e.target.value)} />
            <br /><br />
            <label htmlFor="check-out-time">Check Out Time </label>
            <input id="check-out-time" placeholder="HH:MM"
            value={checkOutTime}
            onChange={(e) => setCheckOutTime(e.target.value)} />
            <br /><br />
            
            
            
            <h2>Additional Options</h2>
            {locFound && loc.dryWashOffered && (<input type="checkbox" id="dryWash-chkbox"  onChange={(e) => setDryWash(e.target.value)} />)}
            {locFound && loc.dryWashOffered && (<label id="dryWash-label" htmlFor="dryWash-chkbox">Dry Cleaning (Rs. 100)</label>)}
            {locFound && loc.carWashOffered && <input type="checkbox" id="carWash-chkbox"  onChange={(e) => setCarWash(e.target.value)} />}
            {locFound && loc.carWashOffered && <label id="carWash-label" htmlFor="carWash-chkbox">Car Wash (Rs. 250)</label>}
            {locFound && loc.repairsOffered && <input type="checkbox" id="repairs-chkbox"  onChange={(e) => setRepairs(e.target.value)} />}
            {locFound && loc.repairsOffered && <label id="repairs-label" htmlFor="repairs-chkbox">Repairs (Rs. 300)</label>}
            <br /><br />
            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </div>
    )
}
 
export default BookSlot;
