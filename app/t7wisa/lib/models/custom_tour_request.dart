class CustomTourRequest {
  final String userEmail;
  final String userName;
  final String startDate;
  final String endDate;
  final List<Map<String, dynamic>> destinations;
  final List<Map<String, dynamic>> hotels;
  final List<Map<String, dynamic>> flights;
  final int numberOfPersons;
  final double proposedPrice;
  final double minimumPrice;
  final double estimatedHotelCost;
  final double totalFlightCost;
  final String? notes;

  CustomTourRequest({
    required this.userEmail,
    required this.userName,
    required this.startDate,
    required this.endDate,
    required this.destinations,
    required this.hotels,
    required this.flights,
    required this.numberOfPersons,
    required this.proposedPrice,
    required this.minimumPrice,
    required this.estimatedHotelCost,
    required this.totalFlightCost,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'user_email': userEmail,
      'user_name': userName,
      'start_date': startDate,
      'end_date': endDate,
      'destinations': destinations,
      'hotels': hotels,
      'flights': flights,
      'number_of_persons': numberOfPersons,
      'proposed_price': proposedPrice,
      'minimum_price': minimumPrice,
      'estimated_hotel_cost': estimatedHotelCost,
      'total_flight_cost': totalFlightCost,
      'notes': notes,
    };
  }
}
