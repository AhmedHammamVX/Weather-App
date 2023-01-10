export class selectedCity {
    country:string;
    lat:number;
    lon:number;
    name:string;
    state:string;

    constructor (country:string,lat:number,lon:number,name:string,state:string)
    {
        this.country = country;
        this.lat = lat;
        this.lon = lon;
        this.name = name;
        this.state = state;
    }
}