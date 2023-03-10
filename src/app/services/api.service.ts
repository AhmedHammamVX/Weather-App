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
  //get weather direction 
  //will just put it here till i understand why it didnt work in cityStatus class!!
  //another question about why.. when i choose my current location the citySuggestions array get changes !!!
  getWDirection(deg:number)
    {
        if (deg>11.25 && deg<33.75){
            return "NNE";
          }else if (deg>33.75 && deg<56.25){
            return "ENE";
          }else if (deg>56.25 && deg<78.75){
            return "E";
          }else if (deg>78.75 && deg<101.25){
            return "ESE";
          }else if (deg>101.25 && deg<123.75){
            return "ESE";
          }else if (deg>123.75 && deg<146.25){
            return "SE";
          }else if (deg>146.25 && deg<168.75){
            return "SSE";
          }else if (deg>168.75 && deg<191.25){
            return "S";
          }else if (deg>191.25 && deg<213.75){
            return "SSW";
          }else if (deg>213.75 && deg<236.25){
            return "SW";
          }else if (deg>236.25 && deg<258.75){
            return "WSW";
          }else if (deg>258.75 && deg<281.25){
            return "W";
          }else if (deg>281.25 && deg<303.75){
            return "WNW";
          }else if (deg>303.75 && deg<326.25){
            return "NW";
          }else if (deg>326.25 && deg<348.75){
            return "NNW";
          }else{
            return "N"; 
          }
    }

}
