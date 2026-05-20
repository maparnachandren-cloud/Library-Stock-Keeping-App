import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Login from './components/Login/Login'
import Signup from './components/Signup/Signup'
import Home from './components/Home/Home'
import BookDetails from './components/BookDetails/BookDetails'
import UserProfile from './components/UserProfile/UserProfile'
import AdminDashboard from './components/AdminDashboard/AdminDashboard'
import AdminAccess from './components/AdminAccess/AdminAccess'
import AddBook from './components/AddBook/AddBook'
import { Route, Routes, Navigate } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Navbar/>
     <Routes>
     <Route path="/" element={<Navigate to="/login"></Navigate>}/>
     <Route path="/login" element={<Login/>}></Route>
     <Route path="/signup" element={<Signup/>}></Route>
     <Route path='/home' element={<Home/>}></Route>
     <Route path='/bookdetails' element={<BookDetails/>}></Route>
     <Route path='/userprofile' element={<UserProfile/>}></Route>
     <Route path='/admindashboard' element={<AdminDashboard/>}></Route>
     <Route path='/adminaccess' element={<AdminAccess/>}></Route>
     <Route path='/addbook' element={<AddBook/>}></Route>
     </Routes>
    </>
  )
}

export default App
