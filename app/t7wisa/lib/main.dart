import 'package:TOURZ/screens/welcome_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:TOURZ/screens/main_screen.dart';
import 'package:TOURZ/util/const.dart';
import 'package:TOURZ/util/theme_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Load saved theme preference
  final isDark = await ThemeProvider.loadThemePreference();

  runApp(
    ChangeNotifierProvider(
      create: (_) => ThemeProvider(isDark: isDark),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Eco Travel',
          theme: themeProvider.themeData,
          home: WelcomeScreen(),
        );
      },
    );
  }
}
