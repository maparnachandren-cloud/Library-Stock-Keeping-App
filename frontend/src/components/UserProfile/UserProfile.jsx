import { useState } from "react";
import "./UserProfile.css";

const UserProfile = () => {

  const [user, setUser] = useState({
    name: "Aparna",
    email: "aparna@gmail.com",
    phone: "9876543210",
    rentedBooks: 3
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {

    setUser({
      ...user,
      [e.target.name]: e.target.value
    });

  };

  return (

    <div className="profile-container">

      <div className="profile-card">

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="profile"
          className="profile-image"
        />

        {
          editMode ? (

            <div className="input-section">

              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Enter Name"
              />

              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Enter Email"
              />

              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                placeholder="Enter Phone"
              />

              <button
                onClick={() => setEditMode(false)}
              >
                Save Profile
              </button>

            </div>

          ) : ( //else this happens

            <div>

              <h2>{user.name}</h2>

              <p>Email: {user.email}</p>

              <p>Phone: {user.phone}</p>

              <p>
                Books Rented: {user.rentedBooks}
              </p>

              <button
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>

            </div>

          )
        }

      </div>

    </div>

  );
};

export default UserProfile;