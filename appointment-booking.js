(function () {
  // Plugin configuration object
  const BookingWidget = {
    // Default options
    options: {
      apiUrl: 'http://localhost:8000/api/v1/appointments',
      containerId: 'appointment-booking-widget',
      primaryColor: '#3b82f6'
    },

    // Initialize the widget with custom options
    init: function (customOptions = {}) {
      // Merge default options with custom options
      this.options = { ...this.options, ...customOptions };

      // Create container if it doesn't exist
      let container = document.getElementById(this.options.containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = this.options.containerId;
        document.body.appendChild(container);
      }

      // Insert HTML and CSS
      this.injectStyles();
      this.renderHTML(container);
      this.initializeEventListeners();
    },

    // Inject CSS into the page
    injectStyles: function () {
      const style = document.createElement('style');
      style.textContent = `
        /* All your CSS goes here */
        :root {
          --primary-color: ${this.options.primaryColor};
          --primary-hover: #2563eb;
          --error-color: #ef4444;
          --success-color: #10b981;
          --border-color: #e5e7eb;
          --bg-color: #f9fafb;
          --text-color: #1f2937;
        }
        
        #${this.options.containerId} * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        #${this.options.containerId} .booking-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        #${this.options.containerId} .booking-header {
          background-color: var(--primary-color);
          color: white;
          padding: 20px;
          text-align: center;
        }
        
        #${this.options.containerId} .booking-form {
          padding: 20px;
        }
        
        #${this.options.containerId} .form-group {
          margin-bottom: 20px;
        }
        
        #${this.options.containerId} .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-color);
        }
        
        #${this.options.containerId} .form-control {
          width: 100%;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        
        #${this.options.containerId} .form-control:focus {
          border-color: var(--primary-color);
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
        
        #${this.options.containerId} .error-message {
          color: var(--error-color);
          font-size: 14px;
          margin-top: 5px;
          display: none;
        }
        
        #${this.options.containerId} .error .form-control {
          border-color: var(--error-color);
        }
        
        #${this.options.containerId} .error .error-message {
          display: block;
        }
        
        #${this.options.containerId} .time-slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
          margin-top: 10px;
           margin-bottom: 20px;
        }
        
        #${this.options.containerId} .time-slot {
          padding: 10px;
          text-align: center;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        #${this.options.containerId} .time-slot:hover {
          border-color: var(--primary-color);
          background-color: rgba(59, 130, 246, 0.1);
        }
        
        #${this.options.containerId} .time-slot.selected {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        #${this.options.containerId} .time-slot.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background-color: #f3f4f6;
        }
        
        #${this.options.containerId} .booking-btn {
          width: 100%;
          padding: 12px;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        #${this.options.containerId} .booking-btn:hover {
          background-color: var(--primary-hover);
        }
        
        #${this.options.containerId} .booking-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        #${this.options.containerId} .success-message {
          padding: 15px;
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid var(--success-color);
          border-radius: 6px;
          color: var(--success-color);
          margin-top: 15px;
          text-align: center;
          display: none;
        }
        
        #${this.options.containerId} .loading {
          position: relative;
          pointer-events: none;
        }
        
        #${this.options.containerId} .loading:after {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          top: 50%;
          left: 50%;
          margin-top: -10px;
          margin-left: -10px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `;
      document.head.appendChild(style);
    },

    // Render HTML content
    renderHTML: function (container) {
      container.innerHTML = `
        <div class="booking-container">
          <div class="booking-header">
            <h2>Book Your Appointment</h2>
          </div>
          <div class="booking-form">
            <form id="bookingForm-${this.options.containerId}" novalidate>
              <div class="form-group">
                <label for="name-${this.options.containerId}">Full Name</label>
                <input type="text" id="name-${this.options.containerId}" name="name" class="form-control" placeholder="Enter your full name" required>
                <span class="error-message">Please enter your name</span>
              </div>
              
              <div class="form-group">
                <label for="phoneNumber-${this.options.containerId}">Phone Number</label>
                <input type="tel" id="phoneNumber-${this.options.containerId}" name="phoneNumber" class="form-control" placeholder="Enter your phone number" required>
                <span class="error-message">Please enter a valid phone number</span>
              </div>
              
              <div class="date-selection">
                <div class="form-group">
                  <label for="date-${this.options.containerId}">Select Date</label>
                  <input type="date" id="date-${this.options.containerId}" name="date" class="form-control date-picker" required>
                  <span class="error-message">Please select a date</span>
                </div>
              </div>
              
              <div class="time-slots-container">
                <label>Select Time Slot</label>
                <div class="time-slots-grid" id="timeSlots-${this.options.containerId}">
                  <p id="noSlotsMessage-${this.options.containerId}" style="grid-column: 1 / -1; text-align: center;">Please select a date to view available time slots</p>
                </div>
                <input type="hidden" id="selectedTimeSlot-${this.options.containerId}" name="timeSlot" required>
                <span class="error-message" id="timeSlotError-${this.options.containerId}">Please select a time slot</span>
              </div>
              
              <button type="submit" class="booking-btn" id="submitBtn-${this.options.containerId}">Book Appointment</button>
            </form>
            
            <div class="success-message" id="successMessage-${this.options.containerId}">
              Your appointment has been booked successfully!
            </div>
          </div>
        </div>
      `;
    },

    // Initialize all event listeners
    initializeEventListeners: function () {
      const bookingForm = document.getElementById(`bookingForm-${this.options.containerId}`);
      const dateInput = document.getElementById(`date-${this.options.containerId}`);
      const timeSlotsGrid = document.getElementById(`timeSlots-${this.options.containerId}`);
      const selectedTimeSlotInput = document.getElementById(`selectedTimeSlot-${this.options.containerId}`);
      const submitBtn = document.getElementById(`submitBtn-${this.options.containerId}`);
      const successMessage = document.getElementById(`successMessage-${this.options.containerId}`);
      const timeSlotError = document.getElementById(`timeSlotError-${this.options.containerId}`);

      // Set minimum date to today and select today's date by default
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const formattedToday = `${yyyy}-${mm}-${dd}`;

      dateInput.min = formattedToday;
      dateInput.value = formattedToday;

      // Fetch time slots for today
      this.generateTimeSlots(formattedToday);

      // Event listener for date input change
      dateInput.addEventListener('change', () => {
        const date = dateInput.value;
        if (date) {
          this.generateTimeSlots(date);
          selectedTimeSlotInput.value = '';
        }
      });

      // Validate form on input
      const formInputs = bookingForm.querySelectorAll('input:not([type="hidden"])');
      formInputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateInput(input);
        });

        input.addEventListener('input', () => {
          if (input.closest('.form-group').classList.contains('error')) {
            this.validateInput(input);
          }
        });
      });

      // Event listener for form submission
      bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all inputs
        let isFormValid = true;

        formInputs.forEach(input => {
          if (!this.validateInput(input)) {
            isFormValid = false;
          }
        });

        // Validate time slot selection
        if (!selectedTimeSlotInput.value) {
          timeSlotError.style.display = 'block';
          isFormValid = false;
        } else {
          timeSlotError.style.display = 'none';
        }

        if (!isFormValid) {
          return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Collect form data
        const formData = new FormData(bookingForm);
        const data = {
          name: formData.get('name'),
          phoneNumber: formData.get('phoneNumber'),
          date: formData.get('date'),
          timeSlot: formData.get('timeSlot'),
        };

        try {
          const result = await this.createAppointment(data);
          bookingForm.style.display = 'none';
          successMessage.style.display = 'block';
        } catch (error) {
          alert('Failed to book appointment. Please try again.');
          console.error(error);
        } finally {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }
      });
    },

    // Fetch available slots from API
    async fetchAvailableSlots(date) {
      const response = await fetch(`${this.options.apiUrl}/slots?date=${date}`);
      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }
      const data = await response.json();
      return data.slots;
    },

    // Create appointment via API
    async createAppointment(data) {
      const response = await fetch(`${this.options.apiUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }
      return response.json();
    },

    // Generate time slots grid
    async generateTimeSlots(date) {
      const timeSlotsGrid = document.getElementById(`timeSlots-${this.options.containerId}`);

      try {
        timeSlotsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Loading available slots...</p>';

        const slots = await this.fetchAvailableSlots(date);

        timeSlotsGrid.innerHTML = '';

        if (slots.length === 0) {
          timeSlotsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No available slots for this date</p>';
          return;
        }

        const selectedTimeSlotInput = document.getElementById(`selectedTimeSlot-${this.options.containerId}`);

        slots.forEach(slot => {
          const slotElement = document.createElement('div');
          slotElement.className = `time-slot ${!slot.available ? 'disabled' : ''}`;
          slotElement.textContent = slot.time;

          if (slot.available) {
            slotElement.addEventListener('click', () => {
              // Remove selected class from all slots
              document.querySelectorAll('.time-slot').forEach(el => {
                el.classList.remove('selected');
              });

              // Add selected class to clicked slot
              slotElement.classList.add('selected');

              // Update hidden input
              selectedTimeSlotInput.value = slot.time;

              // Remove error if exists
              document.getElementById(`timeSlotError-${this.options.containerId}`).style.display = 'none';
            });
          }

          timeSlotsGrid.appendChild(slotElement);
        });
      } catch (error) {
        console.error(error);
        timeSlotsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--error-color);">Failed to load time slots. Please try again.</p>';
      }
    },

    // Validate form input
    validateInput(input) {
      const formGroup = input.closest('.form-group');
      const errorMessage = formGroup.querySelector('.error-message');

      let isValid = true;

      if (input.required && !input.value.trim()) {
        formGroup.classList.add('error');
        isValid = false;
      } else if (input.type === 'tel' && input.value) {
        const phonePattern = /^\+?[0-9\s\-\(\)]{8,}$/;
        if (!phonePattern.test(input.value)) {
          formGroup.classList.add('error');
          errorMessage.textContent = 'Please enter a valid phone number';
          isValid = false;
        } else {
          formGroup.classList.remove('error');
        }
      } else {
        formGroup.classList.remove('error');
      }

      return isValid;
    }
  };

  // Expose the BookingWidget globally
  window.BookingWidget = BookingWidget;
})();