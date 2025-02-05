import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config/apiConfig.js";
import { useContext, useEffect, useState } from "react";
import "../styles/SingleMeal.css";
import spoonIcon from "../assets/bowl-spoon.png";
import calendarIcon from "../assets/calendar-clock.png";
import lunchBoxIcon from "../assets/lunch-box.png";
import hostedIcon from "../assets/meeting-alt.png";
import euroIcon from "../assets/euro.png";
import profileIcon from "../assets/profile.png";
import { AuthContext } from "../contexts/auth.context.jsx";
import { useToast } from "../contexts/toast.context.jsx";

const SingleMeal = () => {
  const { mealId } = useParams();
  const [meal, setMeal] = useState(null);
  const [numberImages, setNumberImages] = useState(1);
  const [showAllImages, setShowAllImages] = useState(false);
  const [host, setHost] = useState(null);
  const { user } = useContext(AuthContext);
  const { setToast } = useToast();
  const nav = useNavigate();

  // Fetch the meal data
  useEffect(() => {
    const getMeal = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/meals/${mealId}`);
        setMeal(data);
        setNumberImages(data.imageUrl.length);
        setHost(data.user);
        // console.log("Meal", data);
      } catch (error) {
        console.log("Error fetching meal", error.response.data.message);
      }
    };
    getMeal();
  }, [mealId]);

  //
  useEffect(() => {
    if (!meal || !meal.user) return;

    const getHost = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/users/${meal.user}`);
        setHost(data);
        // console.log("Host", data);
      } catch (error) {
        console.log("Error fetching user", error.response?.data?.message || error.message);
      }
    };

    getHost();
  }, [meal]);

  const formatDateTime = (isoString, shortWeekday = false) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);

    // Short or full weekday name
    const weekdayFormat = shortWeekday ? "short" : "long";

    // Format the date as "Wed, 20.02.25" or "Wednesday, 20.02.25"
    const formattedDate = `${date.toLocaleDateString("en-GB", {
      weekday: weekdayFormat,
    })}, ${date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })}`;

    // Format the time as "18:30"
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${formattedDate} at ${formattedTime}`;
  };

  const handleAddToCart = (event) => {
    event.preventDefault();
    //
    //
    //
    //
    //
    // TODO: Implement the add-to-cart functionality
    //
    //
    //
    //
    //
    //
  };

  const handleEditMeal = () => {
    nav(`/edit-meal/${mealId}`);
  };

  const handleDeleteMeal = () => {
    //delete meal
    const deleteMeal = async () => {
      try {
        const { data } = await axios.delete(`${API_URL}/api/meals/${mealId}`);
        console.log(data);

        //show success message
        setToast({ msg: "Meal deleted successfully", type: "success" });

        //redirect to all meals
        nav(`/all-meals`);
      } catch (error) {
        console.log(error);
      }
    };
    deleteMeal();
  };

  if (!meal) return <div>Loading...</div>;

  return (
    <div className="single-meal">
      <div className="top-container">
        <div className="header">
          <h1>{meal.title}</h1>
          <Link to={`/all-meals`}>
            <button>Back to all meals</button>
          </Link>
        </div>
        <div className="images-container">
          {/* Only one image */}
          {numberImages === 1 && (
            <div className="main-image">
              <img src={meal.imageUrl[0]} alt={meal.title} />
            </div>
          )}

          {/* Two images */}
          {numberImages === 2 && (
            <>
              <div className="main-image">
                <img src={meal.imageUrl[0]} alt={meal.title} />
              </div>
              <div className="small-images">
                <img src={meal.imageUrl[1]} alt={meal.title} />
              </div>
            </>
          )}

          {/* More than 2 images */}
          {numberImages > 2 && (
            <>
              <div className="main-image">
                <img src={meal.imageUrl[0]} alt={meal.title} />
              </div>
              <div className="small-images">
                <img src={meal.imageUrl[1]} alt={meal.title} />
                <div className="overlay-container">
                  <img src={meal.imageUrl[2]} alt={meal.title} />
                  {numberImages > 3 && !showAllImages && (
                    <button className="show-more-btn" onClick={() => setShowAllImages(true)}>
                      +{numberImages - 3} More
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Show all images in a modal/grid when button is clicked */}
          {showAllImages && (
            <div className="all-images-modal">
              <div className="modal-content">
                <button className="close-btn" onClick={() => setShowAllImages(false)}>
                  ←
                </button>
                <div className="modal-main-image">
                  <img src={meal.imageUrl[0]} alt={meal.title} />
                </div>
                <div className="modal-grid">
                  {meal.imageUrl.slice(1).map((img, index) => (
                    <img key={index} src={img} alt={`Meal image ${index + 1}`} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="info-container">
        <div className="left-column">
          <h2>{meal.cuisine}</h2>
          <p>{meal.description}</p>
          {meal.allergies.map((e) => (
            <p className="one-label" key={e}>
              {e}
            </p>
          ))}
          <p>
            <img src={spoonIcon} alt="Meal icon" className="icon" />
            Plates available: {meal.plates}
          </p>
          <p>
            <img src={calendarIcon} alt="Calendar icon" className="icon" />
            Ready: {formatDateTime(meal.pickupTime, true)}
          </p>
          {meal.hosted ? (
            <p>
              <img src={hostedIcon} className="icon" alt="Host icon" />
              This meal is hosted.
            </p>
          ) : (
            <p>
              <img src={lunchBoxIcon} className="icon" alt="lunchbox icon" />
              This meal is for pickup.
            </p>
          )}
          <p>
            <img src={euroIcon} alt="Price icon" className="icon" />
            Price: {meal.price}€
          </p>
          {user._id !== host._id ? (
            <form onSubmit={handleAddToCart}>
              <label htmlFor="quantity">
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max={meal.plates}
                  defaultValue="1"
                />
              </label>

              <button className="cart-btn">Add to cart</button>
            </form>
          ) : (
            <>
              <button onClick={handleEditMeal}>Edit Meal</button>
              <button onClick={handleDeleteMeal}>Delete Meal</button>
            </>
          )}
        </div>
        <div className="right-column">
          <Link to={`/cook/${host._id}`}>
            <div>
              <h2>The cook</h2>
              <img
                src={host.imageUrl ? host.imageUrl : profileIcon}
                alt="Profile Image"
                className="profile-image"
              />
              <div>
                <h3>{host.username}</h3>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleMeal;
