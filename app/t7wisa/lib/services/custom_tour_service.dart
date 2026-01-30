import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/custom_tour_request.dart';

class CustomTourService {
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';

  Future<Map<String, dynamic>> submitCustomTourRequest(
    CustomTourRequest request,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/custom-tour-bookings'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: json.encode(request.toJson()),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        final errorData = json.decode(response.body);
        throw Exception(
          errorData['error'] ?? 'Failed to submit custom tour request',
        );
      }
    } catch (e) {
      print('Error submitting custom tour request: $e');
      rethrow;
    }
  }
}
