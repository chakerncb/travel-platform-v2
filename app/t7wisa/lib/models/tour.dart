class Tour {
  final int id;
  final String type;
  final String title;
  final String description;
  final String? shortDescription;
  final double price;
  final int durationDays;
  final int? maxGroupSize;
  final String difficultyLevel;
  final DateTime? startDate;
  final DateTime? endDate;
  final bool isActive;
  final bool isEcoFriendly;
  final List<String>? includedServices;
  final List<String>? excludedServices;
  final List<TourDestination>? destinations;
  final List<TourHotel>? hotels;
  final int? reviewsCount;
  final double? averageRating;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Tour({
    required this.id,
    required this.type,
    required this.title,
    required this.description,
    this.shortDescription,
    required this.price,
    required this.durationDays,
    this.maxGroupSize,
    required this.difficultyLevel,
    this.startDate,
    this.endDate,
    required this.isActive,
    required this.isEcoFriendly,
    this.includedServices,
    this.excludedServices,
    this.destinations,
    this.hotels,
    this.reviewsCount,
    this.averageRating,
    this.createdAt,
    this.updatedAt,
  });

  factory Tour.fromJson(Map<String, dynamic> json) {
    return Tour(
      id: json['id'],
      type: json['type'],
      title: json['title'],
      description: json['description'],
      shortDescription: json['short_description'],
      price: double.parse(json['price'].toString()),
      durationDays: json['duration_days'],
      maxGroupSize: json['max_group_size'],
      difficultyLevel: json['difficulty_level'],
      startDate: json['start_date'] != null
          ? DateTime.parse(json['start_date'])
          : null,
      endDate: json['end_date'] != null
          ? DateTime.parse(json['end_date'])
          : null,
      isActive: json['is_active'],
      isEcoFriendly: json['is_eco_friendly'],
      includedServices: json['included_services'] != null
          ? List<String>.from(json['included_services'])
          : null,
      excludedServices: json['excluded_services'] != null
          ? List<String>.from(json['excluded_services'])
          : null,
      destinations: json['destinations'] != null
          ? (json['destinations'] as List)
                .map((dest) => TourDestination.fromJson(dest))
                .toList()
          : null,
      hotels: json['hotels'] != null
          ? (json['hotels'] as List)
                .map((hotel) => TourHotel.fromJson(hotel))
                .toList()
          : null,
      reviewsCount: json['reviews_count'],
      averageRating: json['average_rating'] != null
          ? double.parse(json['average_rating'].toString())
          : null,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'title': title,
      'description': description,
      'short_description': shortDescription,
      'price': price,
      'duration_days': durationDays,
      'max_group_size': maxGroupSize,
      'difficulty_level': difficultyLevel,
      'start_date': startDate?.toIso8601String(),
      'end_date': endDate?.toIso8601String(),
      'is_active': isActive,
      'is_eco_friendly': isEcoFriendly,
      'included_services': includedServices,
      'excluded_services': excludedServices,
      'destinations': destinations?.map((d) => d.toJson()).toList(),
      'hotels': hotels?.map((h) => h.toJson()).toList(),
      'reviews_count': reviewsCount,
      'average_rating': averageRating,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  // Helper getters for compatibility with existing widget code
  String get name => title;
  String get img => destinations?.isNotEmpty == true
      ? destinations!.first.imageUrl ?? 'assets/1.jpeg'
      : 'assets/1.jpeg';
  String get location => destinations?.isNotEmpty == true
      ? '${destinations!.first.city}, ${destinations!.first.country}'
      : '';
  String get priceFormatted =>
      '\$${price.toStringAsFixed(0)}/${durationDays} days';
  String get details => description;
}

class TourDestination {
  final int id;
  final String name;
  final String city;
  final String country;
  final double? latitude;
  final double? longitude;
  final int daysAtDestination;
  final int order;
  final String? imageUrl;
  final String? imageAlt;

  TourDestination({
    required this.id,
    required this.name,
    required this.city,
    required this.country,
    this.latitude,
    this.longitude,
    required this.daysAtDestination,
    required this.order,
    this.imageUrl,
    this.imageAlt,
  });

  factory TourDestination.fromJson(Map<String, dynamic> json) {
    return TourDestination(
      id: json['id'],
      name: json['name'],
      city: json['city'],
      country: json['country'],
      latitude: json['latitude'] != null
          ? double.parse(json['latitude'].toString())
          : null,
      longitude: json['longitude'] != null
          ? double.parse(json['longitude'].toString())
          : null,
      daysAtDestination: json['days_at_destination'],
      order: json['order'],
      imageUrl: json['image_url'],
      imageAlt: json['image_alt'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'city': city,
      'country': country,
      'latitude': latitude,
      'longitude': longitude,
      'days_at_destination': daysAtDestination,
      'order': order,
      'image_url': imageUrl,
      'image_alt': imageAlt,
    };
  }
}

class TourHotel {
  final int id;
  final String name;
  final String city;
  final String country;
  final int? starRating;
  final int nights;
  final int order;

  TourHotel({
    required this.id,
    required this.name,
    required this.city,
    required this.country,
    this.starRating,
    required this.nights,
    required this.order,
  });

  factory TourHotel.fromJson(Map<String, dynamic> json) {
    return TourHotel(
      id: json['id'],
      name: json['name'],
      city: json['city'],
      country: json['country'],
      starRating: json['star_rating'],
      nights: json['nights'],
      order: json['order'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'city': city,
      'country': country,
      'star_rating': starRating,
      'nights': nights,
      'order': order,
    };
  }
}
