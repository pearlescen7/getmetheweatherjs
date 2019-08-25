window.addEventListener('load', ()=> {
    let long;
    let lat;
    let temperatureDescription = document.querySelector('.temperature-description'); 
    let temperatureDegree = document.querySelector('.temperature-degree'); 
    let locationTimezone = document.querySelector('.location-timezone'); 
    let degreeSection = document.querySelector('.degree-section');
    let degreeSectionSpan = document.querySelector('.degree-section span');

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position =>{
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = "http://cors-anywhere.herokuapp.com/";
            const api = `${proxy}https://api.darksky.net/forecast/11c8dbbf2e16815e81e7ee8883284cde/${lat},${long}`;

            fetch(api)
            .then(response =>{
                return response.json();
            })
            .then(data =>{
                console.log(data);
                const {temperature, summary, icon} = data.currently;
                //Setting DOM Elements from the API
                temperatureDegree.textContent = temperature;
                temperatureDescription.textContent = summary;
                locationTimezone.textContent = data.timezone;
                degreeSectionSpan.textContent = 'F';
                let celsius = (temperature - 32) * (5 / 9);
                
                //Setting Icons
                setIcon(icon, document.querySelector(".icon"));

                //Change between Celsius/Fahrenheit
                degreeSection.addEventListener("click", () => {
                    if(degreeSectionSpan.textContent == 'F'){
                        degreeSectionSpan.textContent = 'C';
                        temperatureDegree.textContent = celsius.toFixed(2);
                    } else {
                        degreeSectionSpan.textContent = 'F';
                        temperatureDegree.textContent = temperature;
                    }


                });
            });

        }, declineAlert);

    }

    function setIcon(icon, iconID){
        const skycons = new Skycons({ color: "white" });
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }

    function declineAlert(error) {
        if(error.code == error.PERMISSION_DENIED){
            alert("Please allow location permissions to use the service.");
            temperatureDescription.textContent = "Couldn't retrieve information.";
        }
    }
});


