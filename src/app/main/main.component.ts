import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { cityStatus } from '../models/cityStatus';
import { selectedCity } from '../models/selectedCity';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private apiService: ApiService) { }
  open: boolean = false;
  citySuggestions: any = [];
  @ViewChild('searchInput', {static: true}) searchInput! : ElementRef;
  currentCity:selectedCity = new selectedCity('EG',30.0443879,31.2357257,'Cairo','Cairo');
  cityForecast:cityStatus = new cityStatus({name:'loading'},[{main:{humidity:0,pressure:0,temp:0,temp_max:0,temp_min:0},visibility:0,weather:[{description:'loading',icon:'01n',main:'loading'}],wind:{deg:0,speed:0}}]); 
  cityForecast16:cityStatus["list"] = [{dt:0,main:{humidity:0,pressure:0,temp:0,temp_max:0,temp_min:0},visibility:0,weather:[{description:'loading',icon:'01n',main:'loading'}],wind:{deg:0,speed:0}}];
  tempUnit:string = "metric"; //Celsius
  today:any = this.cityForecast.list[0];
  todaysDate:string = new Date().toUTCString().slice(0,11);
  arrowIcon!:HTMLElement ;

  //open search bar
  openSearchBar() {
    if (this.open == false) {
      this.open = true;
    }
  }

  //close search bar
  closeSearchBar() {
    if (this.open == true) {
      this.open = false;
      //make the search field empty
      this.searchInput.nativeElement.value = "";
      //remove the suggestions
      this.citySuggestions = [];
    }
  }

  //get city suggestions
  getCitySuggestions(cityName: string) {
    if (cityName.trim() !== '') {
      this.apiService.getCitySuggestions(cityName.trim()).subscribe((data) => {
        this.citySuggestions = data;
      }, (error) => {
        console.log(error);
      })
    }
    else
    {
      this.citySuggestions = [];
    }
  }

  //select city which i want to get its temperature 
  selectCity(city:any)
  {
    this.searchInput.nativeElement.value = `${city.name}, ${city.country}`;
    this.currentCity = city as selectedCity;
    this.citySuggestions = [];
    console.log(this.currentCity);
    console.log(this.citySuggestions);
  }

  //rounding degrees
  rounding(degree:number,state:number)
  {
    switch(state)
    {
      case 1:
        return Math.ceil(degree);
        break;
      case 2:
        return Math.floor(degree);
        break;
      default:
        return Math.round(degree);
    } 
  }

  //choose tempreture unit between Celsius & Fahrenheit
  choosedUnit(key:string)
  {
    this.tempUnit = key;
    this.getCityForecast();
  }

  //get my current location
  getMyLocation()
  {
    navigator.geolocation.getCurrentPosition((position) => { 
      console.log("Got position", position.coords);
      this.currentCity.lat = position.coords.latitude;  
      this.currentCity.lon = position.coords.longitude;
      console.log(this.citySuggestions);
      //get city forecast
      this.getCityForecast();
    });
  } 

  //get city forecast
  getCityForecast()
  {
    console.log("new log "+this.currentCity.lat)
    this.apiService.getCityForecast(this.currentCity.lat,this.currentCity.lon,this.tempUnit).subscribe((data)=>{
      this.cityForecast = data as cityStatus;
      this.today = this.cityForecast.list[0];
      this.cityForecast16 = this.cityForecast.list.slice(0,16) as cityStatus["list"];
      console.log(this.cityForecast16);
      //rotate wind arrow 
      this.arrowIcon.style.transform = `rotate(${(this.today.wind.deg)-45}deg)`;
      //close search bar
      this.closeSearchBar();
      console.log(data);
      console.log(this.citySuggestions);
    },(error)=>{
      console.log(error);
    })
  }

  //convert date
  convertDate(date:number)
  {
    return new Date(date*1000).toLocaleString("en-US", {
      hour12: true,
      weekday:"short",
      hour: "numeric",  // ***
    });
  }

  //get weather direction 
   getWDirection(deg:number)
  {
    return this.apiService.getWDirection(deg);
  }

  //counting from 0 to value
  /* counting(end:number)
  {
    
    let start = 0;
    let timer = setInterval(()=>{
      start++
      if(start === end)
      {
        clearInterval(timer);
        return null;
      }
      else
      {
        console.log("testinggg");
        return start;
      }
    },1000);
  } */

  counting(element:HTMLElement,end:number)
  {
    let start = 0;
    let timer = setInterval(()=>{
      start++;
      element.innerText = start.toString();
      if(start === end)
      {
        clearInterval(timer);
      }
    },1000);
    
  }


  ngOnInit(): void {
    //wind arrow
    this.arrowIcon = document.querySelector('.fa-location-arrow')!;
    //display my current location temperature 
    this.getMyLocation();
  }

}
