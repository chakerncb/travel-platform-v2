import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:TOURZ/models/user.dart';
import 'package:TOURZ/util/const.dart';

class AuthService {
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';

  // Register new user
  static Future<AuthResponse> register({
    required String fName,
    required String lName,
    required String email,
    required String password,
    required String passwordConfirmation,
    required String phone,
    String? address,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${Constants.apiBaseUrl}/register'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'f_name': fName,
          'l_name': lName,
          'email': email,
          'password': password,
          'password_confirmation': passwordConfirmation,
          'phone': phone,
          'address': address,
        }),
      );

      final jsonData = json.decode(response.body);

      if (response.statusCode == 200 && jsonData['status'] == true) {
        return AuthResponse.fromJson(jsonData);
      } else {
        throw Exception(jsonData['message'] ?? 'Registration failed');
      }
    } catch (e) {
      throw Exception('Error during registration: $e');
    }
  }

  // Login user
  static Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${Constants.apiBaseUrl}/login'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: json.encode({'email': email, 'password': password}),
      );

      final jsonData = json.decode(response.body);

      if (response.statusCode == 200 && jsonData['status'] == true) {
        final authResponse = AuthResponse.fromJson(jsonData);

        // Save token and user data
        if (authResponse.token != null) {
          await saveToken(authResponse.token!);
        }
        if (authResponse.user != null) {
          await saveUser(authResponse.user!);
        }

        return authResponse;
      } else {
        throw Exception(jsonData['message'] ?? 'Login failed');
      }
    } catch (e) {
      throw Exception('Error during login: $e');
    }
  }

  // Logout user
  static Future<void> logout() async {
    try {
      final token = await getToken();

      if (token != null) {
        await http.post(
          Uri.parse('${Constants.apiBaseUrl}/logout'),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
        );
      }
    } catch (e) {
      print('Error during logout: $e');
    } finally {
      // Clear local data regardless of API call success
      await clearAuthData();
    }
  }

  // Get user profile
  static Future<User?> getProfile() async {
    try {
      final token = await getToken();

      if (token == null) {
        return null;
      }

      final response = await http.get(
        Uri.parse('${Constants.apiBaseUrl}/profile'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        if (jsonData['status'] == true && jsonData['User'] != null) {
          final user = User.fromJson(jsonData['User']);
          await saveUser(user);
          return user;
        }
      }

      return null;
    } catch (e) {
      print('Error fetching profile: $e');
      return null;
    }
  }

  // Save auth token
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  // Get auth token
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  // Save user data
  static Future<void> saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, json.encode(user.toJson()));
  }

  // Get user data
  static Future<User?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString(_userKey);

    if (userData != null) {
      return User.fromJson(json.decode(userData));
    }

    return null;
  }

  // Check if user is logged in
  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }

  // Clear auth data
  static Future<void> clearAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }
}
