import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient:HttpClient) { }
  api:string = "858e005f166fc977d1173a497a742ec7";

  //get city suggestions with lat and lon
  getCitySuggestions = (cityName:string)=>{
    return this.httpClient.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${this.api}`);
  }

  // get city forecast for the next 5 days
  // *For temperature in Fahrenheit use units = imperial
  // *For temperature in Celsius use units = metric
  getCityForecast = (lat:number,lon:number,unit:string)=>{
    return this.httpClient.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.api}&units=${unit}`);
  } 

}
