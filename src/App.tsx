import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "./components/loader";
type Root = {
   total_count: number;
   results: Result[];
};

interface Result {
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

interface Coordinates {
   lon: number;
   lat: number;
}

function App() {
   const [weatherData, setWeatherData] = useState<Result[] | null>(null);

   const [fetching, setFetching] = useState(false);
   const [offset, setOffset] = useState(0);
   useEffect(() => {
      async function fetchData(offset = 0) {
         // prevent multiple calls
         if (fetching) return;
         try {
            setFetching(true);
            const response = await fetch(
               `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?order_by=cou_name_en%2Cascii_name&limit=20&offset=${offset}`
            );

            setFetching(false);
            if (!response.ok) {
               throw new Error(
                  `Network response was not ok (status ${response.status})`
               );
            }

            const data = (await response.json()) as Root;
            setWeatherData((c) =>
               c ? [...c, ...data.results] : [...data.results]
            );
         } catch (error) {
            setFetching(false);
            setWeatherData((c) => (c ? [...c] : c));
            setTimeout(() => {
               fetchData(offset);
            }, 5000);
            console.error("Error fetching data:", error);
         }
      }

      if (!fetching) {
         fetchData(offset);
      }
      const handleScroll = () => {
         if (
            window.innerHeight + document.documentElement.scrollTop !==
            document.documentElement.offsetHeight
         )
            return;

         setOffset((prevOffset) => {
            const offset = prevOffset + 20;
            fetchData(offset);
            return offset;
         });
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);
   return (
      <>
         <h1 className="text-center font-bold text-3xl mb-5 mt-10">
            Weather App
         </h1>
         <div className="max-w-5xl w-full mx-auto p-4">
            <Table className="w-full">
               <TableHeader>
                  <TableRow>
                     <TableHead>City</TableHead>
                     <TableHead>Country</TableHead>
                     <TableHead>Timezone</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {weatherData?.map((data) => (
                     <TableRow key={data.geoname_id}>
                        <TableCell className="font-medium">
                           <Link
                              to={
                                 data.coordinates.lat +
                                 "-" +
                                 data.coordinates.lon
                              }
                           >
                              {data.ascii_name}
                           </Link>
                        </TableCell>

                        <TableCell>{data.cou_name_en}</TableCell>
                        <TableCell>{data.timezone}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
            {fetching ? (
               <div className="mx-auto w-max mt-4">
                  <Loader />
               </div>
            ) : (
               ""
            )}
         </div>
      </>
   );
}

export default App;
