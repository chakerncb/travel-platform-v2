class HotelImage {
  final int id;
  final String imagePath;
  final String? altText;
  final bool isPrimary;
  final int order;

  HotelImage({
    required this.id,
    required this.imagePath,
    this.altText,
    required this.isPrimary,
    required this.order,
  });

  factory HotelImage.fromJson(Map<String, dynamic> json) {
    return HotelImage(
      id: json['id'] ?? 0,
      imagePath: json['image_path'] ?? '',
      altText: json['alt_text'],
      isPrimary: json['is_primary'] ?? false,
      order: json['order'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'image_path': imagePath,
      'alt_text': altText,
      'is_primary': isPrimary,
      'order': order,
    };
  }
}

class Hotel {
  final int id;
  final String name;
  final String? nameAr;
  final int? starRating;
  final String? address;
  final String? city;
  final String? country;
  final double? latitude;
  final double? longitude;
  final String? phone;
  final String? email;
  final String? websiteUrl;
  final String? description;
  final String? amenities;
  final double? pricePerNight;
  final String? currency;
  final double? rating;
  final int? totalReviews;
  final bool isActive;
  final List<HotelImage>? images;
  final String? primaryImage;
  final DateTime createdAt;
  final DateTime updatedAt;

  Hotel({
    required this.id,
    required this.name,
    this.nameAr,
    this.starRating,
    this.address,
    this.city,
    this.country,
    this.latitude,
    this.longitude,
    this.phone,
    this.email,
    this.websiteUrl,
    this.description,
    this.amenities,
    this.pricePerNight,
    this.currency,
    this.rating,
    this.totalReviews,
    required this.isActive,
    this.images,
    this.primaryImage,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Hotel.fromJson(Map<String, dynamic> json) {
    return Hotel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      nameAr: json['name_ar'],
      starRating: json['star_rating'],
      address: json['address'],
      city: json['city'],
      country: json['country'],
      latitude: json['latitude'] != null
          ? double.tryParse(json['latitude'].toString())
          : null,
      longitude: json['longitude'] != null
          ? double.tryParse(json['longitude'].toString())
          : null,
      phone: json['phone'],
      email: json['email'],
      websiteUrl: json['website_url'],
      description: json['description'],
      amenities: json['amenities'],
      pricePerNight: json['price_per_night'] != null
          ? double.tryParse(json['price_per_night'].toString())
          : null,
      currency: json['currency'] ?? 'DA',
      rating: json['rating'] != null
          ? double.tryParse(json['rating'].toString())
          : null,
      totalReviews: json['total_reviews'],
      isActive: json['is_active'] ?? true,
      images: json['images'] != null
          ? (json['images'] as List)
                .map((img) => HotelImage.fromJson(img))
                .toList()
          : null,
      primaryImage: json['primary_image'],
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
      updatedAt: json['updated_at'] != null
          ? DateTime.parse(json['updated_at'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'city': city,
      'country': country,
      'star_rating': starRating,
      'price_per_night': pricePerNight,
      'rating': rating,
    };
  }

  String? get imageUrl {
    if (primaryImage != null && primaryImage!.isNotEmpty) {
      return primaryImage;
    }
    if (images != null && images!.isNotEmpty) {
      return images!.first.imagePath;
    }
    return null;
  }
}

class SelectedHotel extends Hotel {
  final int order;

  SelectedHotel({
    required super.id,
    required super.name,
    super.nameAr,
    super.starRating,
    super.address,
    super.city,
    super.country,
    super.latitude,
    super.longitude,
    super.phone,
    super.email,
    super.websiteUrl,
    super.description,
    super.amenities,
    super.pricePerNight,
    super.currency,
    super.rating,
    super.totalReviews,
    required super.isActive,
    super.images,
    super.primaryImage,
    required super.createdAt,
    required super.updatedAt,
    required this.order,
  });

  factory SelectedHotel.fromHotel(Hotel hotel, int order) {
    return SelectedHotel(
      id: hotel.id,
      name: hotel.name,
      nameAr: hotel.nameAr,
      starRating: hotel.starRating,
      address: hotel.address,
      city: hotel.city,
      country: hotel.country,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      phone: hotel.phone,
      email: hotel.email,
      websiteUrl: hotel.websiteUrl,
      description: hotel.description,
      amenities: hotel.amenities,
      pricePerNight: hotel.pricePerNight,
      currency: hotel.currency,
      rating: hotel.rating,
      totalReviews: hotel.totalReviews,
      isActive: hotel.isActive,
      images: hotel.images,
      primaryImage: hotel.primaryImage,
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt,
      order: order,
    );
  }
}
