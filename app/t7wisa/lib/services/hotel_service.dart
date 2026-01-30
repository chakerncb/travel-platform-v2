import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/hotel.dart';

class HotelService {
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';

  Future<List<Hotel>> getAllHotels() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/hotels'),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonResponse = json.decode(response.body);
        // Handle both paginated response with 'data' key and direct array response
        final dynamic data = jsonResponse.containsKey('data')
            ? jsonResponse['data']
            : jsonResponse;

        if (data is List) {
          return data.map((json) => Hotel.fromJson(json)).toList();
        } else {
          throw Exception('Unexpected response format');
        }
      } else {
        throw Exception('Failed to load hotels: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching hotels: $e');
      rethrow;
    }
  }

  Future<Hotel> getHotelById(int id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/hotels/$id'),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        return Hotel.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to load hotel: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching hotel: $e');
      rethrow;
    }
  }

  Future<List<Hotel>> searchHotels({
    String? city,
    int? minStarRating,
    double? maxPrice,
    String? name,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (city != null) queryParams['city'] = city;
      if (minStarRating != null)
        queryParams['star_rating'] = minStarRating.toString();
      if (maxPrice != null) queryParams['max_price'] = maxPrice.toString();
      if (name != null) queryParams['search'] = name;

      final uri = Uri.parse(
        '$baseUrl/hotels',
      ).replace(queryParameters: queryParams);
      final response = await http.get(
        uri,
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Hotel.fromJson(json)).toList();
      } else {
        throw Exception('Failed to search hotels: ${response.statusCode}');
      }
    } catch (e) {
      print('Error searching hotels: $e');
      rethrow;
    }
  }

  Future<List<Hotel>> getHotelsByCity(String city) async {
    return searchHotels(city: city);
  }

  Future<List<Hotel>> getHotelsByCities(List<String> cities) async {
    try {
      final allHotels = await getAllHotels();
      return allHotels.where((hotel) {
        return hotel.city != null &&
            cities.any(
              (city) => hotel.city!.toLowerCase() == city.toLowerCase(),
            );
      }).toList();
    } catch (e) {
      print('Error fetching hotels by cities: $e');
      rethrow;
    }
  }
}
