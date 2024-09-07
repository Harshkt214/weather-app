// for home page

export type Cities = {
   total_count: number;
   results: Result[];
};

export interface Result {
   geoname_id: string;
   name: string;
   ascii_name: string;
   alternate_names: string[];
   feature_class: string;
   feature_code: string;
   country_code: string;
   cou_name_en: string;
   country_code_2: any;
   admin1_code: string;
   admin2_code: string;
   admin3_code: any;
   admin4_code: any;
   population: number;
   elevation: any;
   dem: number;
   timezone: string;
   modification_date: string;
   label_en: string;
   coordinates: Coordinates;
}

export interface Coordinates {
   lon: number;
   lat: number;
}

// for weather page

export interface Root {
   coord: Coord;
   weather: Weather[];
   base: string;
   main: Main;
   visibility: number;
   wind: Wind;
   clouds: Clouds;
   dt: number;
   sys: Sys;
   timezone: number;
   id: number;
   name: string;
   cod: number;
}

export interface Coord {
   lon: number;
   lat: number;
}

export interface Weather {
   id: number;
   main: string;
   description: string;
   icon: string;
}

export interface Main {
   temp: number;
   feels_like: number;
   temp_min: number;
   temp_max: number;
   pressure: number;
   humidity: number;
   sea_level: number;
   grnd_level: number;
}

export interface Wind {
   speed: number;
   deg: number;
   gust: number;
}

export interface Clouds {
   all: number;
}

export interface Sys {
   country: string;
   sunrise: number;
   sunset: number;
}
