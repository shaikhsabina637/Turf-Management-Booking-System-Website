import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoader } from "../../slices/authSlice";
import { setAllBookings } from "../../slices/bookingSlice";

export const useBookingsDetailsOfAUser = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const fetchBookings = async () => {
    try {
      dispatch(setLoader(true));

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/booking/getAllBookings/${user._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("Response from backend allBookingsOfAUser", response.data.bookings);
      dispatch(setAllBookings(response.data.bookings))
    } catch (error) {
      console.log("Error", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Unable to fetch bookings");
    } finally {
      dispatch(setLoader(false));
    }
  };
  return fetchBookings; 

}

