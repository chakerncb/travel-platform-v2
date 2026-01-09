class PassengerInfo {
  final String firstName;
  final String lastName;
  final String email;
  final String phone;
  final String? dateOfBirth;
  final String? passportNumber;
  final String? nationality;

  PassengerInfo({
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.phone,
    this.dateOfBirth,
    this.passportNumber,
    this.nationality,
  });

  Map<String, dynamic> toJson() {
    return {
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'phone': phone,
      if (dateOfBirth != null) 'dateOfBirth': dateOfBirth,
      if (passportNumber != null) 'passportNumber': passportNumber,
      if (nationality != null) 'nationality': nationality,
    };
  }

  factory PassengerInfo.fromJson(Map<String, dynamic> json) {
    return PassengerInfo(
      firstName: json['first_name'],
      lastName: json['last_name'],
      email: json['email'],
      phone: json['phone'],
      dateOfBirth: json['date_of_birth'],
      passportNumber: json['passport_number'],
      nationality: json['nationality'],
    );
  }
}

class CreateBookingDto {
  final int tourId;
  final String startDate;
  final String endDate;
  final int adultsCount;
  final int childrenCount;
  final double totalPrice;
  final PassengerInfo mainContact;
  final List<PassengerInfo>? passengers;
  final String? specialRequests;

  CreateBookingDto({
    required this.tourId,
    required this.startDate,
    required this.endDate,
    required this.adultsCount,
    required this.childrenCount,
    required this.totalPrice,
    required this.mainContact,
    this.passengers,
    this.specialRequests,
  });

  Map<String, dynamic> toJson() {
    return {
      'tour_id': tourId,
      'start_date': startDate,
      'end_date': endDate,
      'adults_count': adultsCount,
      'children_count': childrenCount,
      'total_price': totalPrice,
      'main_contact': mainContact.toJson(),
      if (passengers != null)
        'passengers': passengers!.map((p) => p.toJson()).toList(),
      if (specialRequests != null) 'special_requests': specialRequests,
    };
  }
}

class Booking {
  final int id;
  final int tourId;
  final int? userId;
  final String bookingReference;
  final DateTime startDate;
  final DateTime endDate;
  final int adultsCount;
  final int childrenCount;
  final double totalPrice;
  final String contactFirstName;
  final String contactLastName;
  final String contactEmail;
  final String contactPhone;
  final String? contactDateOfBirth;
  final String? contactPassportNumber;
  final String? contactNationality;
  final List<PassengerInfo>? passengers;
  final String? specialRequests;
  final String status;
  final String paymentStatus;
  final double? amountPaid;
  final String? paymentMethod;
  final String? paymentTransactionId;
  final String? paymentCheckoutUrl;
  final DateTime? paymentDate;
  final DateTime? cancelledAt;
  final String? cancellationReason;
  final DateTime createdAt;
  final DateTime updatedAt;

  Booking({
    required this.id,
    required this.tourId,
    this.userId,
    required this.bookingReference,
    required this.startDate,
    required this.endDate,
    required this.adultsCount,
    required this.childrenCount,
    required this.totalPrice,
    required this.contactFirstName,
    required this.contactLastName,
    required this.contactEmail,
    required this.contactPhone,
    this.contactDateOfBirth,
    this.contactPassportNumber,
    this.contactNationality,
    this.passengers,
    this.specialRequests,
    required this.status,
    required this.paymentStatus,
    this.amountPaid,
    this.paymentMethod,
    this.paymentTransactionId,
    this.paymentCheckoutUrl,
    this.paymentDate,
    this.cancelledAt,
    this.cancellationReason,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'],
      tourId: json['tour_id'],
      userId: json['user_id'],
      bookingReference: json['booking_reference'],
      startDate: DateTime.parse(json['start_date']),
      endDate: DateTime.parse(json['end_date']),
      adultsCount: json['adults_count'],
      childrenCount: json['children_count'],
      totalPrice: double.parse(json['total_price'].toString()),
      contactFirstName: json['contact_first_name'],
      contactLastName: json['contact_last_name'],
      contactEmail: json['contact_email'],
      contactPhone: json['contact_phone'],
      contactDateOfBirth: json['contact_date_of_birth'],
      contactPassportNumber: json['contact_passport_number'],
      contactNationality: json['contact_nationality'],
      passengers: json['passengers'] != null
          ? (json['passengers'] as List)
                .map((p) => PassengerInfo.fromJson(p))
                .toList()
          : null,
      specialRequests: json['special_requests'],
      status: json['status'],
      paymentStatus: json['payment_status'],
      amountPaid: json['amount_paid'] != null
          ? double.parse(json['amount_paid'].toString())
          : null,
      paymentMethod: json['payment_method'],
      paymentTransactionId: json['payment_transaction_id'],
      paymentCheckoutUrl: json['payment_checkout_url'],
      paymentDate: json['payment_date'] != null
          ? DateTime.parse(json['payment_date'])
          : null,
      cancelledAt: json['cancelled_at'] != null
          ? DateTime.parse(json['cancelled_at'])
          : null,
      cancellationReason: json['cancellation_reason'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }
}

class BookingResponse {
  final bool success;
  final String? message;
  final int? bookingId;
  final String? bookingReference;
  final Booking? booking;
  final String? paymentCheckoutUrl;

  BookingResponse({
    required this.success,
    this.message,
    this.bookingId,
    this.bookingReference,
    this.booking,
    this.paymentCheckoutUrl,
  });

  factory BookingResponse.fromJson(Map<String, dynamic> json) {
    final data = json['data'];

    return BookingResponse(
      success: json['success'] ?? false,
      message: json['message'],
      bookingId: data?['booking_id'],
      bookingReference: data?['booking_reference'],
      booking: data?['booking'] != null
          ? Booking.fromJson(data['booking'])
          : null,
      paymentCheckoutUrl: data?['payment_checkout_url'],
    );
  }
}
