# 🔮 Aura Calendar

A modern, aesthetic, and interactive calendar component built with pure JavaScript, Tailwind CSS, and HTML. Inspired by the clean UI of Google Calendar, this project focuses on fluid animations and essential, easy-to-use features.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

<img width="1919" height="960" alt="Screenshot 2025-11-03 053111" src="https://github.com/user-attachments/assets/d12bad17-028e-450e-8d54-52442b1a3c14" />


---

## ✨ Features

* **Modern & Clean UI**: A beautiful, minimalist design with smooth animations.
* **Persistent Events**: Events are saved to `localStorage`, so they won't disappear when you refresh the page.
* **Full CRUD Functionality**:
    * **Create**: Click any day to add a new event.
    * **Read**: View events directly on the calendar.
    * **Update**: Click an existing event to edit its title, time, or color.
    * **Delete**: Remove events with a single click in the edit modal.
* **Intuitive Navigation**:
    * Click the **Month** to see a dropdown list of all 12 months.
    * Click the **Year** to see a scrollable list of years.
    * Use the **<** and **>**** arrows to navigate by month.
* **Visual Feedback**:
    * The current day is highlighted.
    * Adding or updating an event triggers a subtle "glow" animation on the corresponding day.
    * Dropdowns and modals use fluid `slide-down` and `fade-in` animations.

---

## 🚀 How to Use

1.  **Clone or Download**: Get the files onto your local machine.
    ```bash
    git clone [https://your-repository-link.git](https://your-repository-link.git)
    ```
2.  **Open `index.html`**: No complex build steps required. Just open the `index.html` file in your favorite web browser.

3.  **Start Planning!**:
    * Click on a date to open the "Add Event" modal.
    * Click on an existing event to edit or delete it.
    * Click the month or year in the header to jump to a different time.

---

## 🛠️ Technologies Used

* **HTML5**: For the core structure.
* **Tailwind CSS**: For all styling, animations, and the responsive layout.
* **JavaScript (ES6+)**: For all functionality, including date logic, event handling, and DOM manipulation.
* **Browser `localStorage`**: For persisting event data.
