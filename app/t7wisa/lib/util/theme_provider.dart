import 'package:flutter/material.dart';
import 'package:TOURZ/util/const.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeProvider extends ChangeNotifier {
  ThemeData _themeData;
  bool _isDark;

  ThemeProvider({bool isDark = false})
    : _isDark = isDark,
      _themeData = isDark ? Constants.darkTheme : Constants.lightTheme;

  ThemeData get themeData => _themeData;
  bool get isDark => _isDark;

  void toggleTheme() async {
    _isDark = !_isDark;
    _themeData = _isDark ? Constants.darkTheme : Constants.lightTheme;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDark', _isDark);
  }

  static Future<bool> loadThemePreference() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('isDark') ?? false;
  }
}
