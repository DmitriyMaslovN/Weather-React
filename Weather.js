class AppWeather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: true,
      icon: '',
      city: '',
      country: '',
      wethDesc: '',
      temp: '',
      humidity: '',
      pressure: '',
      celcFarg: 'C',
      pressureBut : 'Pressure'
    };
    this.handleTemp = this.handleTemp.bind(this);
  }
  
  handleTemp(e){
    if(e.target.value == this.state.pressure){
      this.setState({pressureBut: this.state.pressureBut == 'Pressure' ? 
                     this.state.pressure + 'mb' 
                     : 
                     'Pressure'})
    }else{
      this.setState({celcFarg: this.state.celcFarg ==='C' ? 'F' : 'C',
                  temp: this.state.celcFarg === 'C' ?
                  (this.state.temp * 9/5 + 32) 
                   :
                  ((this.state.temp - 32)* 5/9).toFixed(0)});
    }
  }

  
  geoloc(){
  return new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej)
    );
  }
  
  fetchWeather(coordinates){
    fetch(`https://fcc-weather-api.glitch.me/api/current?lat=${coordinates.coords.latitude}&lon=${coordinates.coords.longitude}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: false,
            icon: result.weather[0].icon,
            city: result.name,
            country: result.sys.country,
            wethDesc: result.weather[0].main,
            temp: result.main.temp,
            humidity: result.main.humidity,
            pressure: result.main.pressure
          }); 
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }
  
  async componentDidMount() {
     const coords = await this.geoloc();
    if(coords !== ''){
     this.fetchWeather(coords);
    }
  }
 
  render() {
    const { error, isLoaded, icon, 
           city, wethDesc, temp, humidity,
          country, pressure, celcFarg,
           pressureBut} = this.state;
   if (error) {
      return <div>Error: {error.message}</div>;
    } else if (isLoaded) {
      return <div className="loading">Loading...</div>;
    } else {
      return (
        <div className="main">
          <h1>Local Weather</h1>
          <div className="container">
            <img id="weather" alt="weather" src={icon}/>
            <p className="location">{city}, {country}</p>
            <p className="description">{wethDesc}</p>
            <p className="temp">Temperature: {temp}
              °<span onClick={this.handleTemp}
                     className="celcFarg"
                     value={celcFarg}>
                {celcFarg}
               </span>
            </p>
            <p className="humidity">Humidity: {humidity}% <br/>
              <button className="pressure" onClick={this.handleTemp} 
                      value={this.state.pressure}>
                {pressureBut}
              </button> 
            </p>
          </div>
        </div>
      );
    }
  }
}

ReactDOM.render(<AppWeather />, document.getElementById("root"))
