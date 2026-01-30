class Airport {
  final String type;
  final String subType;
  final String name;
  final String detailedName;
  final String id;
  final String iataCode;
  final GeoCode geoCode;
  final Address address;

  Airport({
    required this.type,
    required this.subType,
    required this.name,
    required this.detailedName,
    required this.id,
    required this.iataCode,
    required this.geoCode,
    required this.address,
  });

  factory Airport.fromJson(Map<String, dynamic> json) {
    return Airport(
      type: json['type'] ?? '',
      subType: json['subType'] ?? '',
      name: json['name'] ?? '',
      detailedName: json['detailedName'] ?? '',
      id: json['id'] ?? '',
      iataCode: json['iataCode'] ?? '',
      geoCode: GeoCode.fromJson(json['geoCode'] ?? {}),
      address: Address.fromJson(json['address'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'subType': subType,
      'name': name,
      'detailedName': detailedName,
      'id': id,
      'iataCode': iataCode,
      'geoCode': geoCode.toJson(),
      'address': address.toJson(),
    };
  }
}

class GeoCode {
  final double latitude;
  final double longitude;

  GeoCode({required this.latitude, required this.longitude});

  factory GeoCode.fromJson(Map<String, dynamic> json) {
    return GeoCode(
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {'latitude': latitude, 'longitude': longitude};
  }
}

class Address {
  final String cityName;
  final String cityCode;
  final String countryName;
  final String countryCode;
  final String? regionCode;

  Address({
    required this.cityName,
    required this.cityCode,
    required this.countryName,
    required this.countryCode,
    this.regionCode,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      cityName: json['cityName'] ?? '',
      cityCode: json['cityCode'] ?? '',
      countryName: json['countryName'] ?? '',
      countryCode: json['countryCode'] ?? '',
      regionCode: json['regionCode'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'cityName': cityName,
      'cityCode': cityCode,
      'countryName': countryName,
      'countryCode': countryCode,
      'regionCode': regionCode,
    };
  }
}

class FlightPrice {
  final String currency;
  final String total;
  final String base;
  final String grandTotal;

  FlightPrice({
    required this.currency,
    required this.total,
    required this.base,
    required this.grandTotal,
  });

  factory FlightPrice.fromJson(Map<String, dynamic> json) {
    return FlightPrice(
      currency: json['currency'] ?? 'EUR',
      total: json['total']?.toString() ?? '0',
      base: json['base']?.toString() ?? '0',
      grandTotal: json['grandTotal']?.toString() ?? '0',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'currency': currency,
      'total': total,
      'base': base,
      'grandTotal': grandTotal,
    };
  }
}

class LocationInfo {
  final String iataCode;
  final String? terminal;
  final String at;

  LocationInfo({required this.iataCode, this.terminal, required this.at});

  factory LocationInfo.fromJson(Map<String, dynamic> json) {
    return LocationInfo(
      iataCode: json['iataCode'] ?? '',
      terminal: json['terminal'],
      at: json['at'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {'iataCode': iataCode, 'terminal': terminal, 'at': at};
  }
}

class Aircraft {
  final String code;

  Aircraft({required this.code});

  factory Aircraft.fromJson(Map<String, dynamic> json) {
    return Aircraft(code: json['code'] ?? '');
  }

  Map<String, dynamic> toJson() {
    return {'code': code};
  }
}

class Segment {
  final LocationInfo departure;
  final LocationInfo arrival;
  final String carrierCode;
  final String number;
  final Aircraft aircraft;
  final String duration;
  final String id;
  final int numberOfStops;

  Segment({
    required this.departure,
    required this.arrival,
    required this.carrierCode,
    required this.number,
    required this.aircraft,
    required this.duration,
    required this.id,
    required this.numberOfStops,
  });

  factory Segment.fromJson(Map<String, dynamic> json) {
    return Segment(
      departure: LocationInfo.fromJson(json['departure'] ?? {}),
      arrival: LocationInfo.fromJson(json['arrival'] ?? {}),
      carrierCode: json['carrierCode'] ?? '',
      number: json['number']?.toString() ?? '',
      aircraft: Aircraft.fromJson(json['aircraft'] ?? {}),
      duration: json['duration'] ?? '',
      id: json['id'] ?? '',
      numberOfStops: json['numberOfStops'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'departure': departure.toJson(),
      'arrival': arrival.toJson(),
      'carrierCode': carrierCode,
      'number': number,
      'aircraft': aircraft.toJson(),
      'duration': duration,
      'id': id,
      'numberOfStops': numberOfStops,
    };
  }
}

class Itinerary {
  final String duration;
  final List<Segment> segments;

  Itinerary({required this.duration, required this.segments});

  factory Itinerary.fromJson(Map<String, dynamic> json) {
    return Itinerary(
      duration: json['duration'] ?? '',
      segments: json['segments'] != null
          ? (json['segments'] as List).map((s) => Segment.fromJson(s)).toList()
          : [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'duration': duration,
      'segments': segments.map((s) => s.toJson()).toList(),
    };
  }
}

class FlightOffer {
  final String type;
  final String id;
  final String source;
  final int numberOfBookableSeats;
  final List<Itinerary> itineraries;
  final FlightPrice price;
  final List<String> validatingAirlineCodes;

  FlightOffer({
    required this.type,
    required this.id,
    required this.source,
    required this.numberOfBookableSeats,
    required this.itineraries,
    required this.price,
    required this.validatingAirlineCodes,
  });

  factory FlightOffer.fromJson(Map<String, dynamic> json) {
    return FlightOffer(
      type: json['type'] ?? '',
      id: json['id'] ?? '',
      source: json['source'] ?? '',
      numberOfBookableSeats: json['numberOfBookableSeats'] ?? 0,
      itineraries: json['itineraries'] != null
          ? (json['itineraries'] as List)
                .map((i) => Itinerary.fromJson(i))
                .toList()
          : [],
      price: FlightPrice.fromJson(json['price'] ?? {}),
      validatingAirlineCodes: json['validatingAirlineCodes'] != null
          ? List<String>.from(json['validatingAirlineCodes'])
          : [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'id': id,
      'source': source,
      'numberOfBookableSeats': numberOfBookableSeats,
      'itineraries': itineraries.map((i) => i.toJson()).toList(),
      'price': price.toJson(),
      'validatingAirlineCodes': validatingAirlineCodes,
    };
  }
}

class FlightSegmentInfo {
  final int segmentIndex;
  final Map<String, dynamic> fromDestination;
  final Map<String, dynamic> toDestination;
  final Airport originAirport;
  final Airport destinationAirport;
  final List<FlightOffer> flightOffers;

  FlightSegmentInfo({
    required this.segmentIndex,
    required this.fromDestination,
    required this.toDestination,
    required this.originAirport,
    required this.destinationAirport,
    required this.flightOffers,
  });

  factory FlightSegmentInfo.fromJson(Map<String, dynamic> json) {
    return FlightSegmentInfo(
      segmentIndex: json['segment_index'] ?? 0,
      fromDestination: json['from_destination'] ?? {},
      toDestination: json['to_destination'] ?? {},
      originAirport: Airport.fromJson(json['origin_airport'] ?? {}),
      destinationAirport: Airport.fromJson(json['destination_airport'] ?? {}),
      flightOffers: json['flight_offers'] != null
          ? (json['flight_offers'] as List)
                .map((f) => FlightOffer.fromJson(f))
                .toList()
          : [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'segment_index': segmentIndex,
      'from_destination': fromDestination,
      'to_destination': toDestination,
      'origin_airport': originAirport.toJson(),
      'destination_airport': destinationAirport.toJson(),
      'flight_offers': flightOffers.map((f) => f.toJson()).toList(),
    };
  }
}
