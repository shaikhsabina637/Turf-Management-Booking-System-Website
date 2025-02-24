import { faLocationPinLock } from '@fortawesome/free-solid-svg-icons';
import { createSlice } from '@reduxjs/toolkit';
const bookings = localStorage.getItem("Bookings");
const allBooked = bookings && bookings !== "undefined" ? JSON.parse(bookings) : [];
const cancel = localStorage.getItem("cancelBookings");
const cancelBookings = cancel && cancel !== "undefined" ? JSON.parse(cancel):[]
const previous = localStorage.getItem("previousBooked");
const previousBooking = previous && previous !== "undefined" ? JSON.parse(previous) : [];
const current = localStorage.getItem("currentBooked");
const currentBooking = current && current !== "undefined" ? JSON.parse(current) : [];


const initialState={
    allBookings: allBooked,
    cancelBooked: cancelBookings,
    previousBookings:previousBooking,
    currentBookings:currentBooking,
}

const bookingSlice= createSlice({
    name:"booking",
    initialState,
    reducers:{
        setAllBookings:(state,action)=>{
            state.allBookings = action.payload;
            localStorage.setItem("Bookings",JSON.stringify(state.allBookings))
        },
        addBooking:(state,action)=>{
            state.allBookings.push(action.payload);
            localStorage.setItem("Bookings",JSON.stringify(state.allBookings));

        },
        cancelBooking: (state, action) => {
            const bookingId = action.payload;
            const canceledBooking = state.currentBookings.find(booking => booking._id === bookingId);
            
            if (canceledBooking) {
                state.currentBookings = state.currentBookings.filter(booking => booking._id !== bookingId);
                localStorage.setItem("currentBooked", JSON.stringify(state.currentBookings));
                state.cancelBooked.push(canceledBooking);
                localStorage.setItem("cancelBookings", JSON.stringify(state.cancelBooked));
                state.allBookings = state.allBookings.filter(booking => booking._id !== bookingId);
                localStorage.setItem("Bookings", JSON.stringify(state.allBookings));
            }
        },setPreviousBookings:(state,action)=>{
              state.previousBookings = action.payload;
              localStorage.setItem("previousBooked",JSON.stringify(state.previousBookings));
        },
        setCurrentBookings:(state,action)=>{
              state.currentBookings=action.payload;
              localStorage.setItem("currentBooked",JSON.stringify(state.currentBookings))
        }
        
    }
});
export const {setAllBookings,addBooking,cancelBooking,setCurrentBookings,setPreviousBookings} = bookingSlice.actions;
export default bookingSlice.reducer;
