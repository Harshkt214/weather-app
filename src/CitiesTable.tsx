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
import { Cities, Result } from "./helpers/types";

function CitiesTable() {
   const [citiesData, setCitiesData] = useState<Result[] | null>(null);
   const [fetching, setFetching] = useState(false);
   const [offset, setOffset] = useState(0);
   useEffect(() => {
      async function fetchData(offset = 0) {
         // prevent multiple calls
         if (fetching) return;
         try {
            setFetching(true);
            const response = await fetch(
               `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?order_by=cou_name_en%2Cascii_name&limit=30&offset=${offset}`
            );

            setFetching(false);
            if (!response.ok) {
               throw new Error(
                  `Network response was not ok (status ${response.status})`
               );
            }

            const data = (await response.json()) as Cities;
            setCitiesData((c) =>
               c ? [...c, ...data.results] : [...data.results]
            );
         } catch (error) {
            setFetching(false);
            setCitiesData((c) => (c ? [...c] : c));
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
   // const estimateItemSize = (index: number): number => {
   //    // This function estimates the height of each list item based on data
   //    const city = citiesData[index];
   //    // Logic to calculate height based on number of lines in city data
   //    // (e.g., consider line breaks or number of properties)
   //    return estimatedHeight;
   //  };
   //  const loadMoreItems = (page: number) => {
   //    const newOffset = page * 30; // Adjust based on your limit
   //    fetchData(newOffset);
   //  };
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
                  {citiesData?.map((data) => (
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

export default CitiesTable;
