import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../services/api.service';

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
  currentCity:any;
  cityForecast:any = [];
  tempUnit:string = "metric"; //Celsius

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
    console.log(city);
    this.searchInput.nativeElement.value = `${city.name}, ${city.country}`;
    this.currentCity = city;
  }

  //get city forecast
  getCityForecast()
  {
    this.apiService.getCityForecast(this.currentCity.lat,this.currentCity.lon,this.tempUnit).subscribe((data)=>{
      this.cityForecast = data;
      console.log(data);
    },(error)=>{
      console.log(error);
    })
  }

  ngOnInit(): void {
  }

}
