import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:TOURZ/models/booking.dart';
import 'package:TOURZ/services/auth_service.dart';
import 'package:TOURZ/util/const.dart';

class BookingService {
  // Create a new booking
  static Future<BookingResponse> createBooking(
    CreateBookingDto bookingData,
  ) async {
    try {
      final token = await AuthService.getToken();
      final headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }

      final response = await http.post(
        Uri.parse('${Constants.apiBaseUrl}/bookings'),
        headers: headers,
        body: json.encode(bookingData.toJson()),
      );

      final jsonData = json.decode(response.body);

      if (response.statusCode == 201 || response.statusCode == 200) {
        return BookingResponse.fromJson(jsonData);
      } else {
        throw Exception(jsonData['message'] ?? 'Failed to create booking');
      }
    } catch (e) {
      throw Exception('Error creating booking: $e');
    }
  }

  // Get all bookings for the current user
  static Future<List<Booking>> getUserBookings() async {
    try {
      final token = await AuthService.getToken();

      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await http.get(
        Uri.parse('${Constants.apiBaseUrl}/bookings'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        final bookingsData = jsonData['data'] as List;
        return bookingsData.map((b) => Booking.fromJson(b)).toList();
      } else {
        throw Exception('Failed to fetch bookings');
      }
    } catch (e) {
      throw Exception('Error fetching bookings: $e');
    }
  }

  // Get booking by ID
  static Future<Booking> getBookingById(int id) async {
    try {
      final token = await AuthService.getToken();

      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await http.get(
        Uri.parse('${Constants.apiBaseUrl}/bookings/$id'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        return Booking.fromJson(jsonData['data']);
      } else {
        throw Exception('Failed to fetch booking');
      }
    } catch (e) {
      throw Exception('Error fetching booking: $e');
    }
  }

  // Get booking by reference
  static Future<Booking> getBookingByReference(String reference) async {
    try {
      final response = await http.get(
        Uri.parse('${Constants.apiBaseUrl}/bookings/reference/$reference'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        return Booking.fromJson(jsonData['data']);
      } else {
        throw Exception('Failed to fetch booking');
      }
    } catch (e) {
      throw Exception('Error fetching booking: $e');
    }
  }

  // Cancel booking
  static Future<void> cancelBooking(int id, String? reason) async {
    try {
      final token = await AuthService.getToken();

      if (token == null) {
        throw Exception('User not authenticated');
      }

      final response = await http.post(
        Uri.parse('${Constants.apiBaseUrl}/bookings/$id/cancel'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'reason': reason}),
      );

      if (response.statusCode != 200) {
        final jsonData = json.decode(response.body);
        throw Exception(jsonData['message'] ?? 'Failed to cancel booking');
      }
    } catch (e) {
      throw Exception('Error canceling booking: $e');
    }
  }

  // Check tour availability
  static Future<Map<String, dynamic>> checkTourAvailability(int tourId) async {
    try {
      final response = await http.get(
        Uri.parse(
          '${Constants.apiBaseUrl}/bookings/tours/$tourId/availability',
        ),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        return jsonData['data'];
      } else {
        throw Exception('Failed to check availability');
      }
    } catch (e) {
      throw Exception('Error checking availability: $e');
    }
  }

  // Check if user has already booked this tour
  static Future<bool> checkUserBooking(int tourId, {String? email}) async {
    try {
      final token = await AuthService.getToken();
      String url =
          '${Constants.apiBaseUrl}/bookings/tours/$tourId/check-user-booking';

      // Add query parameters
      if (email != null && email.isNotEmpty) {
        url += '?email=${Uri.encodeComponent(email)}';
      }

      final headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      // Add auth token if available (same as createUser logic)
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }

      final response = await http.get(Uri.parse(url), headers: headers);

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        return jsonData['data']['has_booking'] ?? false;
      } else {
        print('Error checking booking status: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('Error checking user booking: $e');
      return false;
    }
  }
}
