export function convertKelvin(kelvin: number | undefined | null) {
   // Convert Kelvin to Celsius
   if (!kelvin)
      return {
         celsius: 0,
         fahrenheit: 0,
      };
   const celsius = kelvin - 273.15;

   // Convert Kelvin to Fahrenheit
   const fahrenheit = ((kelvin - 273.15) * 9) / 5 + 32;

   return {
      celsius: celsius.toFixed(2),
      fahrenheit: fahrenheit.toFixed(2),
   };
}
