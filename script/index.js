const UI = (function(){
    let menu = document.querySelector("#menu-container")
    const showApp = ()=>{
        document.querySelector("#app-loader").classList.add("display-none")
        document.querySelector("main").removeAttribute("hidden")
    }
    const loadApp = ()=>{
        document.querySelector("#app-loader").classList.remove("display-none")
        document.querySelector("main").setAttribute("hidden", "true")
    }

    const _showMenu = ()=> menu.style.right = 0
    const _hideMenu = ()=> menu.style.right = "-65%"
    
    const toggleHourlyWeather = ()=>{
        let HourlyWeather = document.querySelector("#hourly-weather-wrapper")
         arrow = document.querySelector("#toggle-hourly-weather").children[0]
         visible = HourlyWeather.getAttribute("visible")
         dailyWeather = document.querySelector("#daily-weather-wrapper")
        
        if(visible == "false"){
            HourlyWeather.setAttribute("visible", "true")
            HourlyWeather.style.bottom = 0
            arrow.style.transform= "rotate(180deg)"
            dailyWeather.style.opacity = 0
        }else if(visible == "true"){
            HourlyWeather.setAttribute("visible", "false")
            HourlyWeather.style.bottom = "-100%"
            arrow.style.transform = "rotate(0deg)"
            dailyWeather.style.opacity = 1
        }else{
            console.log("Unknown State")
        }
    }
    
    const drawWeatherdata =(data, location)=>{
        console.log(location)

        let currentlyData = data.currently
        let dailyData = data.daily.data
        let hourlyData = data.hourly.data
        let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let dailyWeatherWrapper= document.querySelector("#daily-weather-wrapper")
        let dailyWeatherModel
        let day
        let maxMinTemp
        let dailyIcon
        let hourlyWeatherWrapper = document.querySelector("#hourly-weather-wrapper")
        let hourlyWeatherModel
        let hourlyIcon


        //set current weather
        document.querySelectorAll(".location-label").forEach((e)=>{
            e.innerHTML = location
        })

        //set background
        document.querySelector("main").style.backgroundImage = `url("../Resources/assets/images/bg-images/${currentlyData.icon}.jpg")`
        
        //set Icon
        document.querySelector("#currentlyIcon").setAttribute("src", `../Resources/assets/images/summary-icons/${currentlyData.icon}-grey.png`)
        
        //set summary
        document.querySelector("#summary-label").innerHTML = currentlyData.summary

        //convert temperature to celcius
        document.querySelector("#degrees-label").innerHTML = Math.round((
            currentlyData.temperature -32) * 5/9) + "&#176"
            
        //humidity 
        document.querySelector("#humidity-label").innerHTML= Math.round((
            currentlyData.humidity * 100)) + "%"
        
        //set windSpeed
        document.querySelector("#wind-speed-label").innerHTML = (currentlyData.windSpeed *1.6093).toFixed(1) + "kph"
        
        while(dailyWeatherWrapper.children[1]){
            dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[1])
            console.log('while statement')
        }

        for(let i = 0; i <=6; i++){
            //set the day and remove display-none class
            dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true)
            dailyWeatherModel.classList.remove("display-none")

            //set the day
            day = weekdays [new Date(dailyData[i].time * 1000).getDay()]
            dailyWeatherModel.children[0].children[0].innerHTML = day

            //set min/max temp for the next days in temperature
            maxMinTemp = Math.round((dailyData[i].temperatureMax - 32) * 5 / 9 ) + "&#176"
            +  Math.round((dailyData[i].temperatureMin - 32) * 5 / 9 )  + "&#176"
            dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp

            //set daily icon
            dailyIcon = dailyData[i].icon
            dailyWeatherModel.children[1].children[1].children[0].setAttribute("src", `../Resources/assets/images/summary-icons/${dailyIcon}-grey.png`)
            //append the model
            dailyWeatherWrapper.appendChild(dailyWeatherModel)
        }

        dailyWeatherWrapper.children[1].classList.add("current-day-of-the-week")

        //set hourly weather

        while(hourlyWeatherWrapper.children[1]){
            hourlyWeatherWrapper.removeChild(hourlyWeatherWrapper.children[1])
        }

        for(let i = 0; i<=24; i++){
            hourlyWeatherModel = hourlyWeatherWrapper.children[0].cloneNode(true)
            hourlyWeatherModel.classList.remove("display-none")

            //set hour
            hourlyWeatherModel.children[0].children[0].innerHTML= new Date(hourlyData[i].time * 1000).getHours() + ":00"        
            
            //set temperature
            hourlyIcon = hourlyData[i].icon;
            hourlyWeatherModel.children[1].children[1].children[0].setAttribute("src", `../Resources/assets/images/summary-icons/${hourlyIcon}-grey.png`)
        
            hourlyWeatherWrapper.appendChild(hourlyWeatherModel)
        }

        UI.showApp()
    }

    //menu events//
    document.querySelector("#open-menu-button").addEventListener("click", _showMenu)
    document.querySelector("#close-menu-btn").addEventListener("click", _hideMenu)
    
    //hourly weather-wrapper event//
    document.querySelector("#toggle-hourly-weather").addEventListener("click", toggleHourlyWeather)
    return{
        showApp,
        loadApp,
        drawWeatherdata
    }
})()

// ====================================Local Storage==================================================//
const LOCALSTORAGE = (function(){
   let savedCities = []
   const save = (city)=>{
       savedCities.push(city)
       localStorage.setItem("savedCities", JSON.stringify(savedCities))
   } 

   const get = ()=>{
       if(localStorage.getItem("savedCities") !== null){
            savedCities = JSON.parse(localStorage.getItem("savedCities"))
       }
    
   }

   const remove = (index)=> { 
       if(index < savedCities.length){
           savedCities.splice(index, 1)
           localStorage.setItem("savedCities", JSON.stringify(savedCities))
       }
   }

   const getSavedCities = ()=>savedCities

   return{
       save,
       get,
       remove,
       getSavedCities
   }
})()

// ====================================Saved Cities Module==================================================//
const SAVEDCITIES = (function(){
    let container = document.querySelector("#saved-cities-wrapper")
    const drawCity = (city)=>{
        let cityBox = document.createElement("div")
        let cityWrapper = document.createElement("div")
        let deleteWrapper = document.createElement("div")
        let cityTextNode = document.createElement("h1")
        let deleteBtn = document.createElement("button")

        cityBox.classList.add("saved-city-box", "flex-container")
        cityTextNode.innerHTML = city
        cityTextNode.classList.add("set-city")
        cityWrapper.classList.add("rippple", "set-city")

        cityWrapper.append(cityTextNode)
        cityBox.append(cityWrapper)

        deleteBtn.classList.add("ripple", "remove-saved-city")
        deleteBtn.innerHTML = "-"
        deleteWrapper.append(deleteBtn)
        cityBox.append(deleteWrapper)

        container.append(cityBox)
    }
        const _deleteCity = (cityHTMLBtn)=>{
            let nodes = Array.prototype.slice.call(container.children)
            let cityWrapper = cityHTMLBtn.closest(".saved-city-box")
            let cityIndex = nodes.indexOf(cityWrapper)
            LOCALSTORAGE.remove(cityIndex)
            cityWrapper.remove()
        }

        document.addEventListener("click", function(event){
            if(event.target.classList.contains("remove-saved-city")){
                _deleteCity(event.target)
            }
        })

        document.addEventListener("click", function(event){
            if(event.target.classList.contains("set-city")){
                let nodes = Array.prototype.slice.call(container.children)
                let cityWrapper = event.target.closest(".saved-city-box")
                let cityIndex = nodes.indexOf(cityWrapper)  
                let savedCities = LOCALSTORAGE.getSavedCities()

                WEATHER.getWeather(savedCities[cityIndex], false)
            }
        })
        
        return{
            drawCity
        }

})()


// ====================================Get Location==================================================//
const GETLOCATION = (function(){
    let location
    const locationInput = document.querySelector("#location-input")
    const addCityBtn = document.querySelector("#add-city-btn")
    const _addCity = ()=>{
        location = locationInput.value
        locationInput.value = ""
        addCityBtn.setAttribute("disabled", "true")
        addCityBtn.classList.add("disabled")


        WEATHER.getWeather(location, true)
    }
    locationInput.addEventListener("input", function(){
        let inputText = this.value.trim()
        if(inputText != ""){
            addCityBtn.removeAttribute("disabled")
            addCityBtn.classList.remove("disabled")
        }else{
            addCityBtn.setAttribute("disabled", "true")
            addCityBtn.classList.add("disabled")
        }
    })

    addCityBtn.addEventListener("click", _addCity)
})()


// ====================================Get Weatger data==================================================//
const WEATHER = (function(){
    const darkSkyKey = "b6d858edbd22d53006bcbc24e53c7356"
    const geoCoderKey = "e40553c02a4f4cfab2468089d79aa328"

    const _geoCodeURL = (location) => `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${geoCoderKey}`
    const _getDarkSkyUrl = (lat, long) => `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${lat},${long}`

    //get data from dark sky api
    const _getDarkSkyData = (url, location)=>{
        axios.get(url)
            .then((res)=>{
                console.log(res)
                UI.drawWeatherdata(res.data, location)
            })
            .catch((err)=>{
                console.error(err)
            })
    
        }       

    const getWeather = (location, save)=>{
        UI.loadApp()
        let geocodeURL = _geoCodeURL(location)

        axios.get(geocodeURL)
            .then((res)=>{
                if(res.data.results.length == 0){
                    console.log("Invalid Location")
                    UI.showApp()
                    return
                }
                
                if(save){
                    LOCALSTORAGE.save(location)
                    SAVEDCITIES.drawCity(location)
                }
                
                let lat = res.data.results[0].geometry.lat
                let long = res.data.results[0].geometry.lng

                let darkSkyURL = _getDarkSkyUrl(lat, long)
                _getDarkSkyData(darkSkyURL, location)
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    return{
        getWeather
    }
})()


// ====================================Init==================================================//

window.onload = function(){
    LOCALSTORAGE.get()
    let cities = LOCALSTORAGE.getSavedCities()
    if(cities.length != 0){
        cities.forEach((city)=> SAVEDCITIES.drawCity(city))
        WEATHER.getWeather(cities[cities.length - 1], false)
    }else UI.showApp()
    
}