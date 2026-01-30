import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/destination.dart';

class DestinationService {
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';

  Future<List<Destination>> getAllDestinations() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/destinations'),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonResponse = json.decode(response.body);
        // Handle both paginated response with 'data' key and direct array response
        final dynamic data = jsonResponse.containsKey('data')
            ? jsonResponse['data']
            : jsonResponse;

        if (data is List) {
          return data.map((json) => Destination.fromJson(json)).toList();
        } else {
          throw Exception('Unexpected response format');
        }
      } else {
        throw Exception('Failed to load destinations: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching destinations: $e');
      rethrow;
    }
  }

  Future<Destination> getDestinationById(int id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/destinations/$id'),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        return Destination.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to load destination: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching destination: $e');
      rethrow;
    }
  }

  Future<List<Destination>> searchDestinations(String query) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/destinations?search=${Uri.encodeComponent(query)}'),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Destination.fromJson(json)).toList();
      } else {
        throw Exception(
          'Failed to search destinations: ${response.statusCode}',
        );
      }
    } catch (e) {
      print('Error searching destinations: $e');
      rethrow;
    }
  }

  Future<List<Destination>> getDestinationsByCountry(String country) async {
    try {
      final response = await http.get(
        Uri.parse(
          '$baseUrl/destinations?country=${Uri.encodeComponent(country)}',
        ),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Destination.fromJson(json)).toList();
      } else {
        throw Exception(
          'Failed to load destinations by country: ${response.statusCode}',
        );
      }
    } catch (e) {
      print('Error fetching destinations by country: $e');
      rethrow;
    }
  }
}
