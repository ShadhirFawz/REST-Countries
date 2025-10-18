# REST Countries API Documentation

This RESTCountries API to fetch all the country related information to showcase them in a more structured and categorized format, where the site support search functionality, comprehensive keyword searches, add to favourites,  save important information as an image. In order to support multiple users and handle thier favorite personally an authentication with protected login and registration is implemented to give an increased user experience.

<p align='center'>
 <img src="https://github.com/ShadhirFawz/REST-Countries/blob/main/Assets/CSpaceImg.jpg" alt="Screenshot 1" width="300" />
</p>

<p align='center'>
  <img src="https://github.com/ShadhirFawz/REST-Countries/blob/main/Assets/Screenshot%202025-10-18%20131505.png" alt="Screenshot 2" width="500" />
  <img src="https://github.com/ShadhirFawz/REST-Countries/blob/main/Assets/Screenshot%202025-10-18%20131643.png" alt="Screenshot 3" width="500" />
  <img src="https://github.com/ShadhirFawz/REST-Countries/blob/main/Assets/Screenshot%202025-10-18%20131700.png" alt="Screenshot 4" width="500" />
  <img src="https://github.com/ShadhirFawz/REST-Countries/blob/main/Assets/Screenshot%202025-10-18%20131715.png" alt="Screenshot 5" width="500" />
</p>


## Setup Instructions

### **1. Get the repository**
```sh
cd af-2-shadhirfawz
```

### **2. Get to the backend for backend dependency installation**
```sh
cd backend
npm install
```

### **3. Get to the frontend for frontend dependency installation**
```sh
cd frontend
npm install
```

### **4. Setup Environment Variables**
Create a `.env` file in the root directory (backend) and add the following:
```env
PORT=5000
MONGO_URI=<mongodb+srv:<MongoDB_URi>>
JWT_SECRET=<JWT Token>
```

### **5. Start the Server**
```sh
npm run dev
```
The API will run on `http://localhost:5000`.

### **6. Start the client**
```sh
npm run dev
```

---

## 🚀 Technologies used 🚀

 - 📱 [MongoDB](https://www.mongodb.com/)
 - 📱 [Express](https://expressjs.com/)
 - 📱 [React](https://react.dev/)
 - 📱 [Node Js](https://nodejs.org/en)

 ## 🚀 Libraries used 🚀

 - 📱 [React0Icons/Fa](https://www.mongodb.com/)
 - 📱 [Framer Motion](https://expressjs.com/)
 - 📱 [HeroIcons](https://react.dev/)

## Endpoints

### Country Controller

#### Get All Countries
- **Description**: Fetch all countries with pagination.
- **Method**: `GET`
- **Route**: `/api/countries/all`
- **Access**: Private

#### Get Country by Name
- **Description**: Fetch a country by its name.
- **Method**: `GET`
- **Route**: `/api/countries/name/:name`
- **Access**: Private

#### Get Countries by Region
- **Description**: Fetch countries by region.
- **Method**: `GET`
- **Route**: `/api/countries/region/:region`
- **Access**: Private

#### Get Countries by Language
- **Description**: Fetch countries by language.
- **Method**: `GET`
- **Route**: `/api/countries/language/:language`
- **Access**: Private

#### Get Country by Code
- **Description**: Fetch a country by its code.
- **Method**: `GET`
- **Route**: `/api/countries/code/:code`
- **Access**: Private

#### Get Multiple Countries by Codes
- **Description**: Fetch multiple countries by their codes.
- **Method**: `GET`
- **Route**: `/api/countries/codes?codes=est,pe,no`
- **Access**: Private

#### Get Countries by Currency
- **Description**: Fetch countries by currency.
- **Method**: `GET`
- **Route**: `/api/countries/currency/:currency`
- **Access**: Private

#### Get Countries by Demonym
- **Description**: Fetch countries by demonym.
- **Method**: `GET`
- **Route**: `/api/countries/demonym/:demonym`
- **Access**: Private

#### Get Countries by Capital
- **Description**: Fetch countries by capital.
- **Method**: `GET`
- **Route**: `/api/countries/capital/:capital`
- **Access**: Private

#### Get Countries by Subregion
- **Description**: Fetch countries by subregion.
- **Method**: `GET`
- **Route**: `/api/countries/subregion/:subregion`
- **Access**: Private

#### Get Countries by Translation
- **Description**: Fetch countries by translation.
- **Method**: `GET`
- **Route**: `/api/countries/translation/:translation`
- **Access**: Private

---

### User Controller

#### Track Recently Viewed
- **Description**: Track recently viewed countries for a user.
- **Method**: `POST`
- **Route**: `/api/users/recently-viewed`
- **Access**: Private

#### Get Recently Viewed Countries
- **Description**: Fetch recently viewed countries for a user.
- **Method**: `GET`
- **Route**: `/api/users/recently-viewed`
- **Access**: Private

#### Update Profile
- **Description**: Update user profile information.
- **Method**: `PUT`
- **Route**: `/api/users/profile`
- **Access**: Private

#### Reset Password
- **Description**: Reset the user's password.
- **Method**: `PUT`
- **Route**: `/api/users/reset-password`
- **Access**: Private

#### Add or Update Note
- **Description**: Add or update a personal note for a country.
- **Method**: `POST`
- **Route**: `/api/users/note`
- **Access**: Private

#### Get User Notes
- **Description**: Fetch all notes added by the user.
- **Method**: `GET`
- **Route**: `/api/users/notes`
- **Access**: Private

---

### Auth Controller

#### Get Current User
- **Description**: Fetch the currently logged-in user's details.
- **Method**: `GET`
- **Route**: `/api/auth/me`
- **Access**: Private

#### Register User
- **Description**: Register a new user.
- **Method**: `POST`
- **Route**: `/api/auth/register`
- **Access**: Public

#### Login User
- **Description**: Log in a user.
- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Access**: Public

#### Logout User
- **Description**: Log out the current user.
- **Method**: `GET`
- **Route**: `/api/auth/logout`
- **Access**: Private

---

### Favorite Controller

#### Add Favorite
- **Description**: Add a country to the user's favorites.
- **Method**: `POST`
- **Route**: `/api/favorites`
- **Access**: Private

#### Remove Favorite
- **Description**: Remove a country from the user's favorites.
- **Method**: `DELETE`
- **Route**: `/api/favorites/:code`
- **Access**: Private

#### Get Favorites
- **Description**: Fetch all favorite countries of the user.
- **Method**: `GET`
- **Route**: `/api/favorites`
- **Access**: Private
