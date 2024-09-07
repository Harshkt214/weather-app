import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { convertKelvin } from "./helpers/functions/convertTemperature";
import {
   CloudAngledRainIcon,
   CloudAngledZapIcon,
   CloudIcon,
   FastWindIcon,
   HumidityIcon,
   Moon02Icon,
   MoonCloudAngledRainIcon,
   MoonCloudIcon,
   SnowIcon,
   Sun03Icon,
   SunCloud02Icon,
   SunCloudAngledRain02Icon,
} from "./components/icon";
import Loader from "./components/loader";
import { formatDateTime } from "./helpers/functions/formateDate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

type WeatherIcon = React.ReactElement;
const images = {
   "01d": "/images/rainy.jpg",
   "01n": <Moon02Icon className="size-20 text-white" />,
   "02d": <SunCloud02Icon className="size-20 text-white" />,
   "02n": <MoonCloudIcon className="size-20 text-white" />,
   "03d": <CloudIcon className="size-20 text-white" />,
   "03n": <CloudIcon className="size-20 text-white" />,
   "09d": <CloudAngledRainIcon className="size-20 text-white" />,
   "09n": <CloudAngledRainIcon className="size-20 text-white" />,
   "10d": <SunCloudAngledRain02Icon className="size-20 text-white" />,
   "10n": <MoonCloudAngledRainIcon className="size-20 text-white" />,
   "11d": <CloudAngledZapIcon className="size-20 text-white" />,
   "11n": <CloudAngledZapIcon className="size-20 text-white" />,
   "13d": <SnowIcon className="size-20 text-white" />,
   "13n": <SnowIcon className="size-20 text-white" />,
   "50d": <SnowIcon className="size-20 text-white" />,
   "50n": <SnowIcon className="size-20 text-white" />,
};
const icons: Record<string, WeatherIcon> = {
   "01d": <Sun03Icon className="size-20 text-white" />,
   "01n": <Moon02Icon className="size-20 text-white" />,
   "02d": <SunCloud02Icon className="size-20 text-white" />,
   "02n": <MoonCloudIcon className="size-20 text-white" />,
   "03d": <CloudIcon className="size-20 text-white" />,
   "03n": <CloudIcon className="size-20 text-white" />,
   "04d": <CloudIcon className="size-20 text-white" />,
   "04n": <CloudIcon className="size-20 text-white" />,
   "09d": <CloudAngledRainIcon className="size-20 text-white" />,
   "09n": <CloudAngledRainIcon className="size-20 text-white" />,
   "10d": <SunCloudAngledRain02Icon className="size-20 text-white" />,
   "10n": <MoonCloudAngledRainIcon className="size-20 text-white" />,
   "11d": <CloudAngledZapIcon className="size-20 text-white" />,
   "11n": <CloudAngledZapIcon className="size-20 text-white" />,
   "13d": <SnowIcon className="size-20 text-white" />,
   "13n": <SnowIcon className="size-20 text-white" />,
   "50d": <SnowIcon className="size-20 text-white" />,
   "50n": <SnowIcon className="size-20 text-white" />,
};

const handleClick = () => {
   // Your event handling logic here
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
   } else {
      alert("Geolocation is not supported by this browser.");
   }

   function success(position: GeolocationPosition): void {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const newUrl = `/${latitude}-${longitude}`;
      window.location.href = newUrl;
   }

   function error(): void {
      alert("Unable to retrieve your location.");
   }
};

export default function Weather() {
   const { city } = useParams();
   const [latitude, longitude] = city?.split("-") || [];

   const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius");
   if (!latitude || !longitude) {
      return "Something went wrong";
   }

   const [weatherData, setWeatherData] = useState<Root | null>(null);
   const [fetching, setFetching] = useState(false);

   useEffect(() => {
      async function fetchData() {
         if (fetching) return;
         try {
            setFetching(true);
            const response = await fetch(
               `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=12887e2c6b3a63f843081df5bf68dc6b`
            );

            setFetching(false);
            if (!response.ok) {
               throw new Error(
                  `Network response was not ok (status ${response.status})`
               );
            }

            const data = (await response.json()) as Root;
            setWeatherData(data);
         } catch (error) {
            setFetching(false);
            console.error("Error fetching data:", error);
         }
      }

      fetchData();
   }, [latitude, longitude]);

   const handleChange = (value: string) => {
      // @ts-ignore
      setUnit(value);
   };
   return (
      <>
         {fetching ? (
            <div className="h-[100dvh] flex items-center justify-center">
               <Loader />
            </div>
         ) : (
            <main className="max-w-3xl sm:px-4 mx-auto">
               <div className="w-full shadow h-[100dvh] sm:h-max p-4 sm:p-14 sm:rounded-[2rem] sm:mt-10 bg-gradient-to-tr from-violet-500 to-purple-500">
                  <div className="mb-14 flex items-center justify-between">
                     <div>
                        <div className="text-4xl tracking-wide mb-2 text-white">
                           {weatherData?.name}
                        </div>
                        <div className="text-lg text-white/80">
                           {formatDateTime()}
                        </div>
                        <Link
                           to={"/"}
                           className="underline text-white/90 hover:text-white transition-colors pt-6 text-sm mr-2"
                        >
                           Change City
                        </Link>
                        <button
                           onClick={handleClick}
                           className="underline text-white/90 hover:text-white transition-colors pt-6 text-sm"
                        >
                           Use Current Location
                        </button>
                     </div>
                     <Tabs onValueChange={handleChange} defaultValue={unit}>
                        <TabsList className="bg-transparent shadow-none text-white">
                           <TabsTrigger
                              value="celsius"
                              className="w-9 h-9 rounded-lg"
                           >
                              &deg;C
                           </TabsTrigger>
                           <TabsTrigger
                              value="fahrenheit"
                              className="w-9 h-9 rounded-lg"
                           >
                              &deg;F
                           </TabsTrigger>
                        </TabsList>
                     </Tabs>
                  </div>

                  <div className="flex items-center justify-between">
                     <div>
                        {/* @ts-ignore */}
                        {icons[weatherData?.weather[0].icon]}
                        <div>
                           <div className="text-2xl text-white capitalize mt-2">
                              {weatherData?.weather[0].description}
                           </div>
                        </div>
                     </div>
                     <div>
                        <div className="text-5xl font-semibold text-white">
                           {convertKelvin(weatherData?.main.temp)[unit]}&deg;
                        </div>
                        <div className="text-2xl mt-3 font-normal text-white/90">
                           {convertKelvin(weatherData?.main.temp_max)[unit]}
                           &deg;/
                           {convertKelvin(weatherData?.main.temp_min)[unit]}
                           &deg;
                        </div>
                        <div className="text-lg mt-3 text-white/90">
                           Feels like{" "}
                           <span className="font-semibold">
                              {
                                 convertKelvin(weatherData?.main.feels_like)[
                                    unit
                                 ]
                              }
                           </span>
                           &deg;
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 mt-16">
                     <div className="flex items-center gap-2 mx-auto">
                        <HumidityIcon className="size-8 text-white/90" />
                        <div className="text-2xl font-semibold text-white">
                           {weatherData?.main.humidity}%
                           <div className="text-sm font-normal text-white/70">
                              Humidity
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 mx-auto">
                        <FastWindIcon className="size-8 text-white/90" />
                        <div className="text-2xl font-semibold text-white">
                           {weatherData?.wind.speed}{" "}
                           <span className="text-sm">kph</span>
                           <div className="text-sm font-normal text-white/70">
                              Wind Speed
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </main>
         )}
      </>
   );
}
