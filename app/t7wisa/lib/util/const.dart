import 'package:flutter/material.dart';

class Constants {
  static String appName = "Flutter Travel";

  // API Configuration
  // Use 10.0.2.2 for Android emulator, localhost for iOS simulator, or your computer's IP for physical devices
  static String apiBaseUrl = "http://10.0.2.2:8000/api";
  static String apiUrl = "http://10.0.2.2:8000/api/v1";

  // Light Glass Theme Colors
  static Color lightPrimary = Color(0xff96C1B1); // Mint Green
  static Color lightAccent = Color(
    0xff417492,
  ); // Transparent Dark Blue (used as accent)
  static Color lightBackground = Color(0xffFcfcff); // Off-white/pale blue tint
  static Color lightGlass = Color(
    0xffF4E7AC,
  ).withOpacity(0.3); // Champagne with opacity

  static Color lightBG = Color(0xffFcfcff);
  static Color ratingBG = Color(0xfff4e7ac); // Champagne

  // Dark Glass Theme Colors
  static Color darkPrimary = Color(0xff655E95); // Deep Blue-Gray
  static Color darkAccent = Color(0xff417492); // Transparent Dark Blue
  static Color darkBackground = Color(0xff121212); // Dark Grey
  static Color darkGlass = Color(
    0xff417492,
  ).withOpacity(0.3); // Transparent Dark Blue with opacity

  static Color darkBG = Color(0xff121212);
  static Color badgeColor = Color(0xffFFD700); // Gold

  static ThemeData lightTheme = ThemeData(
    primaryColor: lightPrimary,
    scaffoldBackgroundColor: lightBackground,
    cardColor: Colors.white.withOpacity(0.7), // Glassy card
    colorScheme: ColorScheme.light(
      primary: lightPrimary,
      secondary: lightAccent,
      background: lightBackground,
      surface: Colors.white.withOpacity(0.7),
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      titleTextStyle: TextStyle(
        color: Colors.black,
        fontSize: 20,
        fontWeight: FontWeight.w800,
      ),
      iconTheme: IconThemeData(color: Colors.black),
    ),
    textTheme: TextTheme(
      titleLarge: TextStyle(
        color: Colors.black,
        fontSize: 20,
        fontWeight: FontWeight.w800,
      ),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    primaryColor: darkPrimary,
    scaffoldBackgroundColor: darkBackground,
    cardColor: Colors.black.withOpacity(0.5), // Glassy dark card
  );
}
