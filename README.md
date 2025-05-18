This project is created by myself for a custom game which had a competition. This project is specifically developed for single game, and could be improvised and scaled.

This project can be a simple boiler plate for creating a wordpress plugin with beautiful UI, including custom fetching methods integrated with serverless functions of Firebase and Google Cloud api endpoints and a middleware as backend running in node.js.

Deploying documentation is not included in repo, check firebase documentation for the instructions.

---

# 🏆 wp-firebase-leaderboard

A Firebase-powered leaderboard system tailored for WordPress-based games or applications. This project enables real-time tracking and display of user scores, seamlessly integrating Firebase Realtime Database with WordPress.

![image](https://github.com/user-attachments/assets/f8fa1df8-de76-45a6-9519-34cd0116ee30)

![image](https://github.com/user-attachments/assets/be0e4d9f-ed77-46a0-92e6-055ec29e5e80)


---

## 🚀 Features

* Real-time leaderboard updates using Firebase Realtime Database.
* Seamless integration with WordPress.
* User-friendly interface for displaying top scores.
* Secure data handling with Firebase authentication and rules.

---

## 📈 Usage

1. **Displaying the Leaderboard**

   Use the shortcode `[firebase_leaderboard]` in any post or page to display the leaderboard.

2. **Submitting Scores**

   Scores can be submitted via AJAX requests to the plugin's endpoint. Ensure users are authenticated if required.

3. **Customization**

   Modify the `templates/leaderboard.php` file to customize the leaderboard's appearance.

---

## 🧩 Folder Structure

```plaintext
wp-firebase-leaderboard/
├── assets/
│   ├── css/
│   └── js/
├── includes/
│   ├── class-firebase.php
│   └── class-leaderboard.php
├── templates/
│   └── leaderboard.php
├── wp-firebase-leaderboard.php
└── README.md
```


---

## 📞 Contact

For questions or support, please open an issue on the [GitHub repository](https://github.com/utkuakyuz/wp-firebase-leaderboard/issues).

---
