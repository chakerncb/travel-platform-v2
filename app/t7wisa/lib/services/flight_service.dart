import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/flight.dart';

class FlightService {
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';

  Future<List<FlightSegmentInfo>> getCustomTourFlights({
    required List<Map<String, dynamic>> destinations,
    required String startDate,
    required int adults,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/flights/custom-tour'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'destinations': destinations,
          'start_date': startDate,
          'adults': adults,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List<dynamic> flights = data['flights'] ?? [];
        return flights.map((f) => FlightSegmentInfo.fromJson(f)).toList();
      } else {
        print('Flight API error: ${response.statusCode} - ${response.body}');
        throw Exception(
          'Failed to fetch custom tour flights: ${response.statusCode}',
        );
      }
    } catch (e) {
      print('Error fetching custom tour flights: $e');
      rethrow;
    }
  }

  String formatDuration(String duration) {
    final match = RegExp(r'PT(\d+)H?(\d+)?M?').firstMatch(duration);
    if (match == null) return duration;

    final hours = match.group(1) != null ? int.parse(match.group(1)!) : 0;
    final minutes = match.group(2) != null ? int.parse(match.group(2)!) : 0;

    if (hours > 0 && minutes > 0) {
      return '${hours}h ${minutes}m';
    } else if (hours > 0) {
      return '${hours}h';
    } else if (minutes > 0) {
      return '${minutes}m';
    }
    return duration;
  }

  Map<String, String> formatDateTime(String dateTime) {
    final dt = DateTime.parse(dateTime);
    final date = '${_padZero(dt.day)} ${_monthName(dt.month)} ${dt.year}';
    final time = '${_padZero(dt.hour)}:${_padZero(dt.minute)}';

    return {'date': date, 'time': time};
  }

  String _padZero(int value) {
    return value.toString().padLeft(2, '0');
  }

  String _monthName(int month) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[month - 1];
  }

  int getTotalStops(Itinerary itinerary) {
    return itinerary.segments.fold(
      0,
      (total, segment) => total + segment.numberOfStops,
    );
  }

  String getAirlineName(String carrierCode) {
    // Common airline codes - can be expanded
    const airlines = {
      'AF': 'Air France',
      'BA': 'British Airways',
      'LH': 'Lufthansa',
      'EK': 'Emirates',
      'QR': 'Qatar Airways',
      'TK': 'Turkish Airlines',
      'AH': 'Air Algérie',
      'FR': 'Ryanair',
      'U2': 'easyJet',
    };
    return airlines[carrierCode] ?? carrierCode;
  }

  String getCabinClassName(String cabin) {
    const cabinMap = {
      'ECONOMY': 'Economy',
      'PREMIUM_ECONOMY': 'Premium Economy',
      'BUSINESS': 'Business',
      'FIRST': 'First Class',
    };
    return cabinMap[cabin] ?? cabin;
  }
}
