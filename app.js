window.addEventListener('load', ()=> {
    let getterButton = document.querySelector('.getterButton');
    getterButton.addEventListener('click', () =>{
        let long;
        let lat;
        let temperatureDescription = document.querySelector('.temperature-description'); 
        let temperatureDegree = document.querySelector('.temperature-degree'); 
        let locationTimezone = document.querySelector('.location-timezone'); 
        let degreeSection = document.querySelector('.degree-section');
        let degreeSectionSpan = document.querySelector('.degree-section span');
        let dateSection = document.querySelector('.date-section');
        
        setInterval(updateDate, 500);
        function updateDate(){
            let day = new Date().toString();
            day = day.split(' ', 5).join(' ');
            dateSection.textContent = day;
        }

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(position =>{
                long = position.coords.longitude;
                lat = position.coords.latitude;

                const proxy = "http://cors-anywhere.herokuapp.com/";
                const api = `${proxy}https://api.darksky.net/forecast/11c8dbbf2e16815e81e7ee8883284cde/${lat},${long}?units=si`;

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
                    degreeSectionSpan.textContent = 'C';
                    let fahrenheit = (temperature * (9 / 5) + 32);
                    
                    //Setting Icons
                    setIcon(icon, document.querySelector(".icon"));

                    //Change between Celsius/Fahrenheit
                    degreeSection.addEventListener("click", () => {
                        if(degreeSectionSpan.textContent == 'C'){
                            degreeSectionSpan.textContent = 'F';
                            temperatureDegree.textContent = fahrenheit.toFixed(2);
                        } else {
                            degreeSectionSpan.textContent = 'C';
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
});


