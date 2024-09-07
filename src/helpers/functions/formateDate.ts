export function formatDateTime(timeZone: string = "Asia/Kabul") {
   const now = new Date();
   const options = {
      month: "long" as const,
      day: "numeric" as const,
      hour: "numeric" as const,
      minute: "numeric" as const,
      timeZone: timeZone,
   };
   let formattedDate = now.toLocaleString("en-US", options);

   // Adjusting AM/PM format
   const hours = now.getHours();
   const period = hours >= 12 ? "PM" : "AM";
   formattedDate = formattedDate.replace(
      /,\s\d{1,2}:\d{2}/,
      (match) => match + " " + period
   );

   return formattedDate;
}
