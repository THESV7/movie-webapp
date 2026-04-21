import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import MobileNavigation from "./components/MobileNavigation"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setBannerData, setImageURL } from "./store/movieSlice"
import { filterAdult } from "./utils/filterAdult"
import "./App.css"

function App() {
  const dispatch = useDispatch()
  
  const fetchTrendingData = async() =>{
    try {
      const response = await axios.get('/trending/all/week')
      dispatch(setBannerData(filterAdult(response.data.results)))
    } catch (error) {
      console.log("error",error);
      
    }
  }

  const fetchConfiguration = async () =>{
    try {
      const response = await axios.get("/configuration")
      dispatch(setImageURL(response.data.images.secure_base_url + "original"))
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    fetchTrendingData()
    fetchConfiguration()
  },[])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  )
}

export default App
