class DestinationImage {
  final int id;
  final String imagePath;
  final String? altText;
  final bool isPrimary;
  final int order;

  DestinationImage({
    required this.id,
    required this.imagePath,
    this.altText,
    required this.isPrimary,
    required this.order,
  });

  factory DestinationImage.fromJson(Map<String, dynamic> json) {
    return DestinationImage(
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

class Destination {
  final int id;
  final String name;
  final double? latitude;
  final double? longitude;
  final String? description;
  final String? shortDescription;
  final String? city;
  final String country;
  final bool isActive;
  final List<DestinationImage>? images;
  final String? primaryImage;
  final DateTime createdAt;
  final DateTime updatedAt;

  Destination({
    required this.id,
    required this.name,
    this.latitude,
    this.longitude,
    this.description,
    this.shortDescription,
    this.city,
    required this.country,
    required this.isActive,
    this.images,
    this.primaryImage,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Destination.fromJson(Map<String, dynamic> json) {
    return Destination(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      latitude: json['latitude'] != null
          ? double.tryParse(json['latitude'].toString())
          : null,
      longitude: json['longitude'] != null
          ? double.tryParse(json['longitude'].toString())
          : null,
      description: json['description'],
      shortDescription: json['short_description'],
      city: json['city'],
      country: json['country'] ?? '',
      isActive: json['is_active'] ?? true,
      images: json['images'] != null
          ? (json['images'] as List)
                .map((img) => DestinationImage.fromJson(img))
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
      'latitude': latitude?.toString(),
      'longitude': longitude?.toString(),
      'description': description,
      'short_description': shortDescription,
      'city': city,
      'country': country,
      'is_active': isActive,
      'images': images?.map((img) => img.toJson()).toList(),
      'primary_image': primaryImage,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
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

class SelectedDestination extends Destination {
  final int order;

  SelectedDestination({
    required super.id,
    required super.name,
    super.latitude,
    super.longitude,
    super.description,
    super.shortDescription,
    super.city,
    required super.country,
    required super.isActive,
    super.images,
    super.primaryImage,
    required super.createdAt,
    required super.updatedAt,
    required this.order,
  });

  factory SelectedDestination.fromDestination(Destination dest, int order) {
    return SelectedDestination(
      id: dest.id,
      name: dest.name,
      latitude: dest.latitude,
      longitude: dest.longitude,
      description: dest.description,
      shortDescription: dest.shortDescription,
      city: dest.city,
      country: dest.country,
      isActive: dest.isActive,
      images: dest.images,
      primaryImage: dest.primaryImage,
      createdAt: dest.createdAt,
      updatedAt: dest.updatedAt,
      order: order,
    );
  }
}
