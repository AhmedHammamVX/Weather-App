import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { cityStatus } from '../models/cityStatus';
import { selectedCity } from '../models/selectedCity';
import * as $ from 'jquery';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private apiService: ApiService) { }
  open: boolean = false;
  citySuggestions: any = [];
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  currentCity: selectedCity = new selectedCity('EG', 30.0443879, 31.2357257, 'Cairo', 'Cairo');
  cityForecast: cityStatus = new cityStatus({ name: 'loading' }, [{ main: { humidity: 0, pressure: 0, temp: 0, temp_max: 0, temp_min: 0 }, visibility: 0, weather: [{ description: 'loading', icon: '01n', main: 'loading' }], wind: { deg: 0, speed: 0 } }]);
  cityForecast16: cityStatus["list"] = [{ dt: 0, main: { humidity: 0, pressure: 0, temp: 0, temp_max: 0, temp_min: 0 }, visibility: 0, weather: [{ description: 'loading', icon: '01n', main: 'loading' }], wind: { deg: 0, speed: 0 } }];
  tempUnit: string = "metric"; //Celsius
  today: any = this.cityForecast.list[0];
  todaysDate: string = new Date().toUTCString().slice(0, 11);
  arrowIcon!: HTMLElement;
  meterValue: number = 0;
  errorState:boolean = false;

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
    else {
      this.citySuggestions = [];
    }
  }

  //select city which i want to get its temperature 
  selectCity(city: any) {
    this.searchInput.nativeElement.value = `${city.name}, ${city.country}`;
    this.currentCity = city as selectedCity;
    this.citySuggestions = [];
    //console.log(this.currentCity);
    //console.log(this.citySuggestions);
  }

  //rounding degrees
  rounding(degree: number, state: number) {
    switch (state) {
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
  choosedUnit(key: string) {
    this.tempUnit = key;
    this.getCityForecast();
  }

  //get my current location
  getMyLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      //console.log("Got position", position.coords);
      this.currentCity.lat = position.coords.latitude;
      this.currentCity.lon = position.coords.longitude;
      //console.log(this.citySuggestions);
      //get city forecast
      this.getCityForecast();
    });
  }

  //get city forecast
  getCityForecast() {
    if (this.searchInput.nativeElement.value.trim() === '' && this.open == true) {
      this.showError();
    }
    else
    {
      this.apiService.getCityForecast(this.currentCity.lat, this.currentCity.lon, this.tempUnit).subscribe((data) => {
        this.cityForecast = data as cityStatus;
        this.today = this.cityForecast.list[0];
        this.cityForecast16 = this.cityForecast.list.slice(0, 16) as cityStatus["list"];
        //rotate wind arrow 
        this.arrowIcon.style.transform = `rotate(${(this.today.wind.deg) - 45}deg)`;
        //close search bar
        this.closeSearchBar();
        //animate meter
        this.animateMeter(this.today.main.humidity);
      }, (error) => {
        console.log(error);
      })
    }
  }

  //show search field error
  showError()
  {
    this.errorState = true;
    setTimeout(() => {
      this.errorState = false;
    }, 2000);
  }

  //convert date
  convertDate(date: number) {
    return new Date(date * 1000).toLocaleString("en-US", {
      hour12: true,
      weekday: "short",
      hour: "numeric",  // ***
    });
  }

  //get weather direction 
  getWDirection(deg: number) {
    return this.apiService.getWDirection(deg);
  }

  //animate humidity meter
  animateMeter(value: number) {
    this.meterValue = 0;
    console.log("value " + value);
    console.log("meterValue " + this.meterValue);
    let timer = setInterval(() => {
      this.meterValue += 2;
      console.log(this.meterValue);
      if (this.meterValue >= value) {
        clearInterval(timer);
      }
    }, 10);
  }

  ngOnInit(): void {
    //wind arrow
    this.arrowIcon = document.querySelector('.fa-location-arrow')!;
    //display my current location temperature 
    this.getMyLocation();
  }

}
