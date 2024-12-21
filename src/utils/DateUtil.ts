class DateUtil {

  static formatChatResponseDate(dateString: number) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateString);

    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    return `${day}-${month}-${year} ${hours}:${minutesStr} ${ampm}`;
}

static formatDateAndTime = ():string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date();

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const amPm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // Convert 24-hour to 12-hour format

  return `${day}-${month}-${year} ${hours}:${minutes} ${amPm}`;
}
  static formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  static convertToIST(dateString: any) {
    let date;

    // Check if input is a timestamp (number), ISO format, or custom format  
    if (typeof dateString === 'number') {
      date = new Date(dateString);
    } else if (typeof dateString === 'string') {
      // Handle custom format (YYYY-MM-DD HH:mm:ss)  
      if (dateString.includes(' ')) {
        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);

        // Create a new Date object using the parsed values  
        date = new Date(year, month - 1, day, hours, minutes, seconds);
      } else {
        // Handle ISO format  
        date = new Date(dateString);
      }
    } else {
      throw new Error('Invalid date format');
    }

    // Extract day, month, year, hours, and minutes  
    const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero  
    const year = date.getFullYear();

    // Month abbreviation  
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const month = monthNames[date.getMonth()]; // Get month abbreviation  

    let hours: any = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format  
    hours = hours % 12;
    hours = hours ? String(hours) : '12'; // the hour '0' should be '12'  

    // Format minutes with leading zero  
    const minutesStr = String(minutes).padStart(2, '0');

    // Return formatted date  
    return `${day}-${month}-${year} ${hours}:${minutesStr}${ampm}`;
  }

  static formatDateToISO(dateString: string) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;

}

}
export default DateUtil;