import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:t7wisa/models/tour.dart';
import 'package:t7wisa/util/const.dart';

class ApiService {
  static Future<List<Tour>> fetchTours({
    bool? active,
    String? type,
    String? difficulty,
    bool? ecoFriendly,
    double? minPrice,
    double? maxPrice,
    int? minDuration,
    int? maxDuration,
    String? search,
    int perPage = 15,
  }) async {
    try {
      // Build query parameters
      final queryParameters = <String, String>{};

      if (active != null) queryParameters['active'] = active.toString();
      if (type != null) queryParameters['type'] = type;
      if (difficulty != null) queryParameters['difficulty'] = difficulty;
      if (ecoFriendly != null)
        queryParameters['eco_friendly'] = ecoFriendly.toString();
      if (minPrice != null) queryParameters['min_price'] = minPrice.toString();
      if (maxPrice != null) queryParameters['max_price'] = maxPrice.toString();
      if (minDuration != null)
        queryParameters['min_duration'] = minDuration.toString();
      if (maxDuration != null)
        queryParameters['max_duration'] = maxDuration.toString();
      if (search != null) queryParameters['search'] = search;
      queryParameters['per_page'] = perPage.toString();

      final uri = Uri.parse(
        '${Constants.apiUrl}/tours',
      ).replace(queryParameters: queryParameters);

      final response = await http.get(
        uri,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        final List<dynamic> toursJson = jsonData['data'];
        return toursJson.map((json) => Tour.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load tours: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching tours: $e');
    }
  }

  static Future<Tour> fetchTourById(int id) async {
    try {
      final response = await http.get(
        Uri.parse('${Constants.apiUrl}/tours/$id'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        return Tour.fromJson(jsonData['data']);
      } else {
        throw Exception('Failed to load tour: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching tour: $e');
    }
  }
}
