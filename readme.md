# Appointment Booking Widget Plugin

A customizable, embeddable appointment booking widget for websites. This plugin allows users to book appointments directly from your site, with features like form validation, time slot selection, and API integration for appointment management.

## Features

- **Customizable Appearance**: Modify colors and styles to match your site's design.
- **Form Validation**: Ensures all required fields are filled out correctly.
- **Time Slot Selection**: Dynamically fetches available time slots based on the selected date.
- **API Integration**: Seamlessly integrates with your backend to create appointments.
- **Responsive Design**: Works well on both desktop and mobile devices.

## Installation

### Embedding the Plugin

1. **Download the Plugin**: Download the `booking-widget.js` file from the repository.
2. **Host the Plugin**: Upload the `booking-widget.js` file to your web server or a CDN.
3. **Embed the Script**: Add the following script tag to your HTML where you want the widget to appear:

```html
<script src="path/to/booking-widget.js"></script>
<script>
  window.onload = function () {
    BookingWidget.init({
      apiUrl: "http://your-api-url.com/api/v1/appointments",
      containerId: "appointment-booking-widget",
      primaryColor: "#3b82f6",
    });
  };
</script>
```

## Configuration Options

| Option         | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `apiUrl`       | The URL of your appointment API.                                     |
| `containerId`  | The ID of the container where the widget will be rendered.           |
| `primaryColor` | The primary color used in the widget's styling (default: `#3b82f6`). |

## Usage

### Initializing the Widget

To initialize the widget, call the `init` method with your custom options:

```javascript
BookingWidget.init({
  apiUrl: "http://your-api-url.com/api/v1/appointments",
  containerId: "appointment-booking-widget",
  primaryColor: "#3b82f6",
});
```

### Customizing the Widget

You can customize the appearance of the widget by modifying the `primaryColor` option or by adding custom CSS rules that target the widget's elements.

## API Endpoints

Ensure your API endpoints are set up to handle requests from the widget. The widget expects the following endpoints:

### Fetch Available Time Slots

**GET** `/api/v1/appointments/slots?date=YYYY-MM-DD`

#### Example Response:

```json
{
  "slots": [
    { "time": "09:00", "available": true },
    { "time": "10:00", "available": false },
    { "time": "11:00", "available": true }
  ]
}
```

### Create an Appointment

**POST** `/api/v1/appointments/`

#### Example Payload:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "date": "2025-03-01",
  "time": "09:00"
}
```

## Example Usage

### HTML Implementation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Appointment Booking</title>
  </head>
  <body>
    <div id="appointment-booking-widget"></div>
    <script src="path/to/booking-widget.js"></script>
    <script>
      window.onload = function () {
        BookingWidget.init({
          apiUrl: "http://your-api-url.com/api/v1/appointments",
          containerId: "appointment-booking-widget",
          primaryColor: "#3b82f6",
        });
      };
    </script>
  </body>
</html>
```

## Custom CSS (Optional)

You can add custom CSS to further style the widget:

```css
#appointment-booking-widget .booking-container {
  /* Custom styles */
}
```
