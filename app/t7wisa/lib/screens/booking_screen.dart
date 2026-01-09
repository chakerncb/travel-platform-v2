import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:t7wisa/models/booking.dart';
import 'package:t7wisa/models/tour.dart';
import 'package:t7wisa/services/booking_service.dart';
import 'package:t7wisa/services/auth_service.dart';
import 'package:url_launcher/url_launcher.dart';

class BookingScreen extends StatefulWidget {
  final Tour tour;

  const BookingScreen({Key? key, required this.tour}) : super(key: key);

  @override
  _BookingScreenState createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  final _formKey = GlobalKey<FormState>();

  DateTime? _startDate;
  DateTime? _endDate;
  int _adultsCount = 1;
  int _childrenCount = 0;
  List<String> _additionalPeople = [];
  bool _hasExistingBooking = false;
  bool _checkingBooking = true;

  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _dateOfBirthController = TextEditingController();
  final _passportNumberController = TextEditingController();
  final _nationalityController = TextEditingController();
  final _specialRequestsController = TextEditingController();

  bool _isLoading = false;
  bool _isCheckingAvailability = true;
  Map<String, dynamic>? _availability;

  @override
  void initState() {
    super.initState();
    // Set booking dates to match tour dates
    _startDate = widget.tour.startDate;
    _endDate = widget.tour.endDate;
    _checkAvailability();
    _loadUserData();
    _checkExistingBooking();
  }

  Future<void> _loadUserData() async {
    final user = await AuthService.getUser();
    if (user != null) {
      setState(() {
        _firstNameController.text = user.fName;
        _lastNameController.text = user.lName;
        _emailController.text = user.email;
        _phoneController.text = user.phone ?? '';
      });
    }
  }

  Future<void> _checkAvailability() async {
    try {
      final availability = await BookingService.checkTourAvailability(
        widget.tour.id,
      );
      setState(() {
        _availability = availability;
        _isCheckingAvailability = false;
      });
    } catch (e) {
      setState(() {
        _isCheckingAvailability = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to check availability: $e')),
      );
    }
  }

  Future<void> _checkExistingBooking() async {
    try {
      final email = _emailController.text;
      final hasBooking = await BookingService.checkUserBooking(
        widget.tour.id,
        email: email.isNotEmpty ? email : null,
      );
      setState(() {
        _hasExistingBooking = hasBooking;
        _checkingBooking = false;
      });
    } catch (e) {
      setState(() {
        _checkingBooking = false;
      });
    }
  }

  double get _totalPrice {
    return widget.tour.price *
        (_adultsCount + _childrenCount * 0.7 + _additionalPeople.length);
  }

  int get _totalPassengers =>
      _adultsCount + _childrenCount + _additionalPeople.length;

  bool get _hasAvailablePlaces {
    if (_availability == null) return false;
    final remaining = _availability!['remaining_places'] ?? 0;
    return remaining >= _totalPassengers;
  }

  Future<void> _selectDate(BuildContext context, bool isStartDate) async {
    final DateTime now = DateTime.now();
    final DateTime firstDate = now;
    final DateTime lastDate = DateTime(now.year + 2);

    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: isStartDate
          ? (_startDate ?? widget.tour.startDate ?? now)
          : (_endDate ??
                widget.tour.endDate ??
                now.add(Duration(days: widget.tour.durationDays))),
      firstDate: firstDate,
      lastDate: lastDate,
    );

    if (picked != null) {
      setState(() {
        if (isStartDate) {
          _startDate = picked;
          // Auto-calculate end date based on tour duration
          _endDate = picked.add(Duration(days: widget.tour.durationDays));
        } else {
          _endDate = picked;
        }
      });
    }
  }

  Future<void> _selectDateOfBirth(BuildContext context) async {
    final DateTime now = DateTime.now();
    final DateTime firstDate = DateTime(now.year - 100);
    final DateTime lastDate = now;

    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: now.subtract(Duration(days: 365 * 25)),
      firstDate: firstDate,
      lastDate: lastDate,
    );

    if (picked != null) {
      setState(() {
        _dateOfBirthController.text = DateFormat('yyyy-MM-dd').format(picked);
      });
    }
  }

  Future<void> _submitBooking() async {
    // Validate required contact information
    if (_firstNameController.text.isEmpty ||
        _lastNameController.text.isEmpty ||
        _emailController.text.isEmpty ||
        _phoneController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'User information is incomplete. Please update your profile.',
          ),
        ),
      );
      return;
    }

    if (_startDate == null || _endDate == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Tour dates are not available')));
      return;
    }

    if (!_hasAvailablePlaces) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Not enough available places for this tour')),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final mainContact = PassengerInfo(
        firstName: _firstNameController.text,
        lastName: _lastNameController.text,
        email: _emailController.text,
        phone: _phoneController.text,
        dateOfBirth: _dateOfBirthController.text.isNotEmpty
            ? _dateOfBirthController.text
            : null,
        passportNumber: _passportNumberController.text.isNotEmpty
            ? _passportNumberController.text
            : null,
        nationality: _nationalityController.text.isNotEmpty
            ? _nationalityController.text
            : null,
      );

      final bookingData = CreateBookingDto(
        tourId: widget.tour.id,
        startDate: DateFormat('yyyy-MM-dd').format(_startDate!),
        endDate: DateFormat('yyyy-MM-dd').format(_endDate!),
        adultsCount: _adultsCount,
        childrenCount: _childrenCount,
        totalPrice: _totalPrice,
        mainContact: mainContact,
        specialRequests: _specialRequestsController.text.isNotEmpty
            ? _specialRequestsController.text
            : null,
      );

      final response = await BookingService.createBooking(bookingData);

      setState(() {
        _isLoading = false;
      });

      if (response.success) {
        // If there's a payment checkout URL, open it
        if (response.paymentCheckoutUrl != null) {
          final url = Uri.parse(response.paymentCheckoutUrl!);
          if (await canLaunchUrl(url)) {
            await launchUrl(url, mode: LaunchMode.externalApplication);
          }
        }

        // Show success dialog
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => AlertDialog(
            title: Text('Booking Successful!'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Your booking has been created successfully.'),
                SizedBox(height: 10),
                Text(
                  'Booking Reference: ${response.bookingReference}',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 10),
                Text('Please check your email for confirmation details.'),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop(); // Close dialog
                  Navigator.of(context).pop(); // Go back to tour details
                },
                child: Text('OK'),
              ),
            ],
          ),
        );
      } else {
        throw Exception(response.message ?? 'Booking failed');
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Booking failed: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _dateOfBirthController.dispose();
    _passportNumberController.dispose();
    _nationalityController.dispose();
    _specialRequestsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Book Tour'), elevation: 0),
      body: _isCheckingAvailability
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                children: [
                  // Tour Summary Card
                  Container(
                    width: double.infinity,
                    color: Theme.of(context).primaryColor.withOpacity(0.1),
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.tour.title,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(Icons.schedule, size: 16),
                            SizedBox(width: 4),
                            Text('${widget.tour.durationDays} days'),
                            SizedBox(width: 16),
                            Icon(Icons.attach_money, size: 16),
                            Text(
                              '\$${widget.tour.price.toStringAsFixed(2)} per person',
                            ),
                          ],
                        ),
                        if (_availability != null) ...[
                          SizedBox(height: 8),
                          Row(
                            children: [
                              Text(
                                'Available places: ${_availability!['remaining_places']} / ${_availability!['max_group_size']}',
                                style: TextStyle(
                                  color: _hasAvailablePlaces
                                      ? Colors.green
                                      : Colors.red,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              if (_availability!['remaining_places'] <= 5 &&
                                  _availability!['remaining_places'] > 0) ...[
                                SizedBox(width: 8),
                                Text(
                                  '⚠️ Filling Fast!',
                                  style: TextStyle(
                                    color: Colors.orange,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ],
                        if (widget.tour.isEcoFriendly) ...[
                          SizedBox(height: 8),
                          Container(
                            padding: EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.green.withOpacity(0.1),
                              border: Border.all(color: Colors.green),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.eco, size: 16, color: Colors.green),
                                SizedBox(width: 4),
                                Text(
                                  '🌿 Eco-Friendly Tour',
                                  style: TextStyle(
                                    color: Colors.green.shade800,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),

                  // Booking Form
                  Padding(
                    padding: EdgeInsets.all(16),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Tour Period Display
                          if (widget.tour.startDate != null ||
                              widget.tour.endDate != null) ...[
                            Text(
                              'Tour Period',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 8),
                            Container(
                              padding: EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.blue.withOpacity(0.05),
                                border: Border.all(
                                  color: Colors.blue.withOpacity(0.3),
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.calendar_today,
                                    size: 16,
                                    color: Colors.blue,
                                  ),
                                  SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      '${widget.tour.startDate != null ? DateFormat('MMM dd, yyyy').format(widget.tour.startDate!) : 'TBD'} - ${widget.tour.endDate != null ? DateFormat('MMM dd, yyyy').format(widget.tour.endDate!) : 'TBD'}',
                                      style: TextStyle(fontSize: 14),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            SizedBox(height: 24),
                          ],

                          // Contact Information Section
                          Text(
                            'Contact Information',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: TextFormField(
                                  controller: _firstNameController,
                                  decoration: InputDecoration(
                                    labelText: 'First Name *',
                                    border: OutlineInputBorder(),
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Required';
                                    }
                                    return null;
                                  },
                                ),
                              ),
                              SizedBox(width: 12),
                              Expanded(
                                child: TextFormField(
                                  controller: _lastNameController,
                                  decoration: InputDecoration(
                                    labelText: 'Last Name *',
                                    border: OutlineInputBorder(),
                                  ),
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'Required';
                                    }
                                    return null;
                                  },
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 16),
                          TextFormField(
                            controller: _emailController,
                            decoration: InputDecoration(
                              labelText: 'Email *',
                              border: OutlineInputBorder(),
                            ),
                            keyboardType: TextInputType.emailAddress,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Email is required';
                              }
                              if (!value.contains('@')) {
                                return 'Enter a valid email';
                              }
                              return null;
                            },
                          ),
                          SizedBox(height: 16),
                          TextFormField(
                            controller: _phoneController,
                            decoration: InputDecoration(
                              labelText: 'Phone *',
                              border: OutlineInputBorder(),
                            ),
                            keyboardType: TextInputType.phone,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Phone is required';
                              }
                              return null;
                            },
                          ),
                          SizedBox(height: 16),
                          TextFormField(
                            controller: _dateOfBirthController,
                            decoration: InputDecoration(
                              labelText: 'Date of Birth (Optional)',
                              border: OutlineInputBorder(),
                              suffixIcon: Icon(Icons.calendar_today),
                            ),
                            readOnly: true,
                            onTap: () => _selectDateOfBirth(context),
                          ),
                          SizedBox(height: 16),
                          TextFormField(
                            controller: _passportNumberController,
                            decoration: InputDecoration(
                              labelText: 'Passport Number (Optional)',
                              border: OutlineInputBorder(),
                            ),
                          ),
                          SizedBox(height: 16),
                          TextFormField(
                            controller: _nationalityController,
                            decoration: InputDecoration(
                              labelText: 'Nationality (Optional)',
                              border: OutlineInputBorder(),
                            ),
                          ),
                          SizedBox(height: 24),

                          // Additional Participants Section
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Additional Participants',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                'Max ${_availability?['max_group_size'] ?? widget.tour.maxGroupSize ?? 20} people',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 16),

                          // Additional People
                          ..._additionalPeople
                              .asMap()
                              .entries
                              .map(
                                (entry) => Container(
                                  margin: EdgeInsets.only(top: 12),
                                  padding: EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.grey[100],
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'Additional Participant ${entry.key + 1}',
                                        style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      Row(
                                        children: [
                                          Text(
                                            '\$${widget.tour.price.toStringAsFixed(2)}',
                                            style: TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          SizedBox(width: 8),
                                          IconButton(
                                            icon: Icon(
                                              Icons.remove_circle,
                                              color: Colors.red,
                                            ),
                                            onPressed: () {
                                              setState(() {
                                                _additionalPeople.removeAt(
                                                  entry.key,
                                                );
                                              });
                                            },
                                            constraints: BoxConstraints(),
                                            padding: EdgeInsets.zero,
                                            iconSize: 24,
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              )
                              .toList(),

                          // Add Person Button
                          if (_totalPassengers <
                              (_availability?['remaining_places'] ??
                                  widget.tour.maxGroupSize ??
                                  20)) ...[
                            SizedBox(height: 12),
                            OutlinedButton.icon(
                              onPressed: () {
                                setState(() {
                                  _additionalPeople.add('');
                                });
                              },
                              icon: Icon(Icons.add),
                              label: Text(
                                'Add Participant ($_totalPassengers/${_availability?['remaining_places'] ?? widget.tour.maxGroupSize ?? 20})',
                              ),
                              style: OutlinedButton.styleFrom(
                                minimumSize: Size(double.infinity, 40),
                              ),
                            ),
                          ],

                          if (!_hasAvailablePlaces) ...[
                            SizedBox(height: 12),
                            Container(
                              padding: EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.orange.withOpacity(0.1),
                                border: Border.all(color: Colors.orange),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                'Not enough places available. Only ${_availability?['remaining_places'] ?? 0} places left.',
                                style: TextStyle(
                                  color: Colors.orange.shade900,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],

                          SizedBox(height: 24),

                          // Special Requests (Optional)
                          Text(
                            'Special Requests (Optional)',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 16),
                          TextFormField(
                            controller: _specialRequestsController,
                            decoration: InputDecoration(
                              labelText:
                                  'Any special requests or requirements?',
                              border: OutlineInputBorder(),
                              alignLabelWithHint: true,
                            ),
                            maxLines: 3,
                          ),

                          SizedBox(height: 24),

                          // Included Services
                          if (widget.tour.includedServices != null &&
                              widget.tour.includedServices!.isNotEmpty) ...[
                            Text(
                              'Included Services',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 12),
                            Container(
                              padding: EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.green.withOpacity(0.05),
                                border: Border.all(
                                  color: Colors.green.withOpacity(0.3),
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: widget.tour.includedServices!
                                    .map(
                                      (service) => Padding(
                                        padding: EdgeInsets.only(bottom: 8),
                                        child: Row(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Icon(
                                              Icons.check_circle,
                                              size: 16,
                                              color: Colors.green,
                                            ),
                                            SizedBox(width: 8),
                                            Expanded(
                                              child: Text(
                                                service,
                                                style: TextStyle(
                                                  fontSize: 13,
                                                  color: Colors.grey[700],
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    )
                                    .toList(),
                              ),
                            ),
                            SizedBox(height: 24),
                          ],

                          // Total Price
                          Container(
                            padding: EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.grey[100],
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Total Price',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '\$${_totalPrice.toStringAsFixed(2)}',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Theme.of(context).primaryColor,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          SizedBox(height: 24),

                          // Submit Button
                          SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                              onPressed:
                                  _isLoading ||
                                      !_hasAvailablePlaces ||
                                      _checkingBooking ||
                                      _hasExistingBooking
                                  ? null
                                  : _submitBooking,
                              style: ElevatedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                backgroundColor: _hasExistingBooking
                                    ? Colors.grey
                                    : null,
                              ),
                              child: _isLoading
                                  ? CircularProgressIndicator(
                                      color: Colors.white,
                                    )
                                  : _checkingBooking
                                  ? Text(
                                      'Checking...',
                                      style: TextStyle(fontSize: 18),
                                    )
                                  : _hasExistingBooking
                                  ? Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Icon(Icons.check_circle),
                                        SizedBox(width: 8),
                                        Text(
                                          'Already Booked',
                                          style: TextStyle(fontSize: 18),
                                        ),
                                      ],
                                    )
                                  : Text(
                                      'Confirm Booking',
                                      style: TextStyle(fontSize: 18),
                                    ),
                            ),
                          ),

                          // Existing Booking Warning
                          if (_hasExistingBooking && !_checkingBooking) ...[
                            SizedBox(height: 12),
                            Container(
                              padding: EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.blue.withOpacity(0.1),
                                border: Border.all(color: Colors.blue),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.info,
                                    color: Colors.blue,
                                    size: 20,
                                  ),
                                  SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      'You have already booked this tour. Check your email for booking details.',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.blue.shade900,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],

                          SizedBox(height: 16),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildCounterCard(
    String label,
    int value,
    Function(int) onChanged, {
    int min = 0,
    int? max,
  }) {
    return Container(
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Text(
            label,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
          ),
          SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              IconButton(
                icon: Icon(Icons.remove_circle_outline),
                onPressed: value > min ? () => onChanged(value - 1) : null,
                color: value > min
                    ? Theme.of(context).primaryColor
                    : Colors.grey,
              ),
              Text(
                value.toString(),
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              IconButton(
                icon: Icon(Icons.add_circle_outline),
                onPressed: (max == null || value < max)
                    ? () => onChanged(value + 1)
                    : null,
                color: (max == null || value < max)
                    ? Theme.of(context).primaryColor
                    : Colors.grey,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
