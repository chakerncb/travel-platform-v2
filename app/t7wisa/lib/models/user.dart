class User {
  final int? id;
  final String fName;
  final String lName;
  final String email;
  final String? phone;
  final String? address;
  final bool isAdmin;
  final DateTime? emailVerifiedAt;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  User({
    this.id,
    required this.fName,
    required this.lName,
    required this.email,
    this.phone,
    this.address,
    this.isAdmin = false,
    this.emailVerifiedAt,
    this.createdAt,
    this.updatedAt,
  });

  String get fullName => '$fName $lName';

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      fName: json['f_name'],
      lName: json['l_name'],
      email: json['email'],
      phone: json['phone'],
      address: json['address'],
      isAdmin: json['is_admin'] == 1 || json['is_admin'] == true,
      emailVerifiedAt: json['email_verified_at'] != null
          ? DateTime.parse(json['email_verified_at'])
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
      'f_name': fName,
      'l_name': lName,
      'email': email,
      'phone': phone,
      'address': address,
      'is_admin': isAdmin,
      'email_verified_at': emailVerifiedAt?.toIso8601String(),
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}

class AuthResponse {
  final bool status;
  final String message;
  final String? token;
  final User? user;

  AuthResponse({
    required this.status,
    required this.message,
    this.token,
    this.user,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      status: json['status'],
      message: json['message'],
      token: json['token'],
      user: json['User'] != null || json['user'] != null
          ? User.fromJson(json['User'] ?? json['user'])
          : null,
    );
  }
}
