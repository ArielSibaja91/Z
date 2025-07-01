# Chirp Z
Welcome to Chirp Z! The Twitter-like social media app.

## Redux-Bloglist
The final project of part 7 of the basic course is a list of blogs to be developed with React Query or Redux, for consistency it was decided to use Redux. The goal was to unite the backend developed previously in part 4 with a complete frontend (styles, routing and state management).

## Technologies Used

### Backend:
[![My Skills](https://skillicons.dev/icons?i=ts,nodejs,express,mongo&theme=dark)](https://skillicons.dev)
<br>
For the backend project, `NodeJS` with `Express` and `Typescript` was used to develop a `RESTful API` that communicates with the NoSQL database `MongoDB` using the `Mongoose` ODM. `Bycrypt` is used for secure password hashing, authentication is token-based with the use of `JWT`. `Cloudinary` service is used to upload profile and cover images for the user profiles, and images inside posts.


### Frontend:
[![My Skills](https://skillicons.dev/icons?i=ts,react,tailwind,vite,redux&theme=dark)](https://skillicons.dev)
<br>
For the frontend, `Vite` is used to create a `React` with `Typescript` project and manage the development environment. For routing the app is using `React-Router-Dom`. `Redux Toolkit` is used for state management, the data retrieval and caching tool `RTK Query` is used to make HTTP requests to the backend, cache the responses and manage all the async data optimally. `Tailwind CSS` was used to style the app swiftly and create a UI similar to `Twitter`.

### Features


* User authentication with JWT (login, signup, logout)

* Creation and elimination of posts

* Different feed types to navigate trought posts

* Commenting posts functionality

* Like posts functionality

* User profiles

* Follow/Unfollow users

* Edit user profile functionality

* Notifications page, delete and clear notifications


## Installation

Before you begin, make sure you have the following programs installed:

* **Node.js**: LTS version is recommended. You can download it from [nodejs.org](https://nodejs.org/).
* **npm** or **Yarn**: npm comes with Node.js, but you can also use Yarn.
    * For npm: `npm install npm@latest -g`
    * For Yarn: `npm install --global Yarn`
* **MongoDB**: You will need a `MongoDB` instance. You can install it locally or use a cloud service like MongoDB Atlas.

* **Cloudinary**: You will also need a `Cloudinary` account to the upload of images when using the app.

First, clone this repository to your local machine using Git:

```bash
git clone https://github.com/ArielSibaja91/Z.git
cd Z
```

Once cloned, you will have all the content of the project inside of the `Z` folder. The project is divided in `Backend` and `Frontend` folders.

#### Backend Configuration

Navigate to the `backend` directory and install the dependencies:

```bash
cd Backend
npm install
# or if you use Yarn:
# yarn install
```

Create a `.env` file in the `backend` directory with the following variables:

```
MONGO_URL=<your-mongodb-connection-string>
PORT=5000
JWT_SECRET=<your-jwt-secret-key>
NODE_ENV=<development-for-devs>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret-key>
```

Then, start the backend server:

```bash
npm run dev
# or yarn dev
```

#### Frontend Configuration

Navigate to the frontend directory and install the dependencies:

```bash
cd ../Frontend # Assuming you are in the 'backend' directory
npm install
# or yarn install
```
Then, start the `vite` server:

```bash
npm run dev
# or yarn dev
```

The frontend application should open in your default browser, typically at `http://localhost:3000`

## Usage

Create a user on the registration page or log in if you already have an account, when you enter the app you will be able to see the list of posts in the db, create a new post entry, add an image to your post if you want, see the users of the app, follow them and see their posts, see users profiles, update your own profile, add profile and/or cover images to your profile.

### **Live Demo**

You can see the demo app deployed on Render on this link: https://chirp-z.onrender.com