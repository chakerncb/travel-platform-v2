import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:intl/intl.dart';
import '../models/destination.dart';
import '../models/hotel.dart';
import '../models/flight.dart';
import '../models/custom_tour_request.dart';
import '../services/destination_service.dart';
import '../services/hotel_service.dart';
import '../services/flight_service.dart';
import '../services/custom_tour_service.dart';
import '../services/auth_service.dart';
import '../widgets/destination_card.dart';
import '../widgets/hotel_card.dart';
import '../widgets/flight_card.dart';

class CustomTourScreen extends StatefulWidget {
  const CustomTourScreen({Key? key}) : super(key: key);

  @override
  _CustomTourScreenState createState() => _CustomTourScreenState();
}

class _CustomTourScreenState extends State<CustomTourScreen>
    with TickerProviderStateMixin {
  final destinationService = DestinationService();
  final hotelService = HotelService();
  final flightService = FlightService();
  final customTourService = CustomTourService();

  // Data
  List<Destination> _allDestinations = [];
  List<Hotel> _allHotels = [];
  List<SelectedDestination> _selectedDestinations = [];
  List<SelectedHotel> _selectedHotels = [];
  List<FlightSegmentInfo> _flightSegments = [];
  Map<int, FlightOffer> _selectedFlights = {};

  // State
  bool _loading = true;
  bool _loadingFlights = false;
  String _searchQuery = '';
  bool _isMapCollapsed = false;

  // Booking
  DateTime _startDate = DateTime.now().add(const Duration(days: 7));
  DateTime? _endDate;
  int _numberOfPersons = 1;
  String _notes = '';
  double _proposedPrice = 0;

  // Tab controller
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    try {
      final destinations = await destinationService.getAllDestinations();
      final hotels = await hotelService.getAllHotels();
      setState(() {
        _allDestinations = destinations;
        _allHotels = hotels;
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error loading data: $e')));
      }
    }
  }

  Future<void> _fetchFlights() async {
    if (_selectedDestinations.length < 2) {
      setState(() {
        _flightSegments = [];
      });
      return;
    }

    // Check if destinations span multiple countries
    final countries = _selectedDestinations.map((d) => d.country).toSet();
    if (countries.length < 2) {
      setState(() {
        _flightSegments = [];
      });
      return;
    }

    setState(() => _loadingFlights = true);
    try {
      final destinationsData = _selectedDestinations
          .map(
            (d) => {
              'city': d.city ?? d.name,
              'country': d.country,
              'latitude': d.latitude,
              'longitude': d.longitude,
            },
          )
          .toList();

      final segments = await flightService.getCustomTourFlights(
        destinations: destinationsData,
        startDate: DateFormat('yyyy-MM-dd').format(_startDate),
        adults: _numberOfPersons,
      );

      setState(() {
        _flightSegments = segments;
        _loadingFlights = false;
      });
    } catch (e) {
      print('Error fetching flights: $e');
      setState(() {
        _loadingFlights = false;
        _flightSegments = [];
      });
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error fetching flights: $e')));
      }
    }
  }

  void _addDestination(Destination destination) {
    if (!_selectedDestinations.any((d) => d.id == destination.id)) {
      setState(() {
        _selectedDestinations.add(
          SelectedDestination.fromDestination(
            destination,
            _selectedDestinations.length + 1,
          ),
        );
        _searchQuery = '';
      });
      _fetchFlights();
      Navigator.pop(context);
    }
  }

  void _removeDestination(int id) {
    setState(() {
      _selectedDestinations.removeWhere((d) => d.id == id);
      // Reorder
      for (var i = 0; i < _selectedDestinations.length; i++) {
        _selectedDestinations[i] = SelectedDestination.fromDestination(
          _selectedDestinations[i],
          i + 1,
        );
      }
    });
    _fetchFlights();
  }

  void _addHotel(Hotel hotel) {
    if (!_selectedHotels.any((h) => h.id == hotel.id)) {
      setState(() {
        _selectedHotels.add(
          SelectedHotel.fromHotel(hotel, _selectedHotels.length + 1),
        );
      });
      Navigator.pop(context);
    }
  }

  void _removeHotel(int id) {
    setState(() {
      _selectedHotels.removeWhere((h) => h.id == id);
      for (var i = 0; i < _selectedHotels.length; i++) {
        _selectedHotels[i] = SelectedHotel.fromHotel(_selectedHotels[i], i + 1);
      }
    });
  }

  List<Hotel> get _filteredHotels {
    if (_selectedDestinations.isEmpty) return [];

    final selectedCities = _selectedDestinations
        .where((d) => d.city != null)
        .map((d) => d.city!.toLowerCase())
        .toSet();

    return _allHotels.where((hotel) {
      if (hotel.city == null) return false;
      final inSelectedCity = selectedCities.contains(hotel.city!.toLowerCase());
      if (!inSelectedCity) return false;

      if (_searchQuery.isEmpty) return true;
      return hotel.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (hotel.city?.toLowerCase().contains(_searchQuery.toLowerCase()) ??
              false);
    }).toList();
  }

  List<Destination> get _filteredDestinations {
    if (_searchQuery.isEmpty) return _allDestinations;
    return _allDestinations.where((dest) {
      return dest.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (dest.city?.toLowerCase().contains(_searchQuery.toLowerCase()) ??
              false) ||
          dest.country.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();
  }

  double get _minimumPrice {
    final destinationCost = _selectedDestinations.length * 50.0;
    final hotelCost = _selectedHotels.fold<double>(
      0,
      (sum, hotel) =>
          sum + (hotel.pricePerNight ?? 100) * _selectedDestinations.length,
    );
    final flightCost = _selectedFlights.values.fold<double>(
      0,
      (sum, flight) => sum + double.parse(flight.price.total),
    );
    return (destinationCost + hotelCost + flightCost) * _numberOfPersons;
  }

  void _showDestinationPicker() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        minChildSize: 0.5,
        maxChildSize: 0.9,
        expand: false,
        builder: (context, scrollController) => Column(
          children: [
            Material(
              elevation: 4,
              child: Container(
                color: Theme.of(context).primaryColor,
                child: SafeArea(
                  bottom: false,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 12,
                        ),
                        child: Row(
                          children: [
                            const SizedBox(width: 8),
                            const Expanded(
                              child: Text(
                                'Select Destinations',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            IconButton(
                              icon: const Icon(
                                Icons.close,
                                color: Colors.white,
                              ),
                              onPressed: () => Navigator.pop(context),
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                        child: TextField(
                          decoration: InputDecoration(
                            hintText: 'Search destinations...',
                            prefixIcon: const Icon(Icons.search),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            filled: true,
                            fillColor: Colors.white,
                          ),
                          onChanged: (value) =>
                              setState(() => _searchQuery = value),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Expanded(
              child: ListView.builder(
                controller: scrollController,
                itemCount: _filteredDestinations.length,
                itemBuilder: (context, index) {
                  final dest = _filteredDestinations[index];
                  final isSelected = _selectedDestinations.any(
                    (d) => d.id == dest.id,
                  );
                  return DestinationCard(
                    destination: dest,
                    isSelected: isSelected,
                    onTap: isSelected ? null : () => _addDestination(dest),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showHotelPicker() {
    if (_selectedDestinations.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select destinations first')),
      );
      return;
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        minChildSize: 0.5,
        maxChildSize: 0.9,
        expand: false,
        builder: (context, scrollController) => Column(
          children: [
            Material(
              elevation: 4,
              child: Container(
                color: Theme.of(context).primaryColor,
                child: SafeArea(
                  bottom: false,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 12,
                        ),
                        child: Row(
                          children: [
                            const SizedBox(width: 8),
                            const Expanded(
                              child: Text(
                                'Select Hotels',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            IconButton(
                              icon: const Icon(
                                Icons.close,
                                color: Colors.white,
                              ),
                              onPressed: () => Navigator.pop(context),
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                        child: TextField(
                          decoration: InputDecoration(
                            hintText: 'Search hotels...',
                            prefixIcon: const Icon(Icons.search),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            filled: true,
                            fillColor: Colors.white,
                          ),
                          onChanged: (value) =>
                              setState(() => _searchQuery = value),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Expanded(
              child: _filteredHotels.isEmpty
                  ? const Center(
                      child: Text(
                        'No hotels available in selected destinations',
                      ),
                    )
                  : ListView.builder(
                      controller: scrollController,
                      itemCount: _filteredHotels.length,
                      itemBuilder: (context, index) {
                        final hotel = _filteredHotels[index];
                        final isSelected = _selectedHotels.any(
                          (h) => h.id == hotel.id,
                        );
                        return HotelCard(
                          hotel: hotel,
                          isSelected: isSelected,
                          onTap: isSelected ? null : () => _addHotel(hotel),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  void _showBookingForm() async {
    if (!await AuthService.isLoggedIn()) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please sign in to request a custom tour'),
          ),
        );
      }
      return;
    }

    if (_selectedDestinations.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add at least one destination')),
      );
      return;
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Booking Details',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              // Date pickers
              Row(
                children: [
                  Expanded(
                    child: ListTile(
                      title: const Text('Start Date'),
                      subtitle: Text(
                        DateFormat('MMM dd, yyyy').format(_startDate),
                      ),
                      trailing: const Icon(Icons.calendar_today),
                      onTap: () async {
                        final date = await showDatePicker(
                          context: context,
                          initialDate: _startDate,
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(
                            const Duration(days: 365),
                          ),
                        );
                        if (date != null) {
                          setState(() => _startDate = date);
                        }
                      },
                    ),
                  ),
                  Expanded(
                    child: ListTile(
                      title: const Text('End Date'),
                      subtitle: Text(
                        _endDate != null
                            ? DateFormat('MMM dd, yyyy').format(_endDate!)
                            : 'Optional',
                      ),
                      trailing: const Icon(Icons.calendar_today),
                      onTap: () async {
                        final date = await showDatePicker(
                          context: context,
                          initialDate:
                              _endDate ??
                              _startDate.add(const Duration(days: 7)),
                          firstDate: _startDate,
                          lastDate: DateTime.now().add(
                            const Duration(days: 365),
                          ),
                        );
                        if (date != null) {
                          setState(() => _endDate = date);
                        }
                      },
                    ),
                  ),
                ],
              ),
              // Number of persons
              ListTile(
                title: const Text('Number of Persons'),
                subtitle: Text(
                  '$_numberOfPersons person${_numberOfPersons > 1 ? 's' : ''}',
                ),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.remove_circle_outline),
                      onPressed: _numberOfPersons > 1
                          ? () => setState(() => _numberOfPersons--)
                          : null,
                    ),
                    IconButton(
                      icon: const Icon(Icons.add_circle_outline),
                      onPressed: () => setState(() => _numberOfPersons++),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              // Minimum price
              Card(
                color: Colors.blue[50],
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Minimum Price:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'DA ${_minimumPrice.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              // Proposed price
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Your Proposed Price (DA)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.attach_money),
                ),
                keyboardType: TextInputType.number,
                onChanged: (value) {
                  setState(() => _proposedPrice = double.tryParse(value) ?? 0);
                },
              ),
              const SizedBox(height: 16),
              // Notes
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Special Requests (Optional)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.notes),
                ),
                maxLines: 3,
                onChanged: (value) => setState(() => _notes = value),
              ),
              const SizedBox(height: 24),
              // Submit button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submitRequest,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: Colors.blue,
                  ),
                  child: const Text(
                    'Submit Request',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _submitRequest() async {
    if (_proposedPrice < _minimumPrice) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Proposed price must be at least DA${_minimumPrice.toStringAsFixed(2)}',
          ),
        ),
      );
      return;
    }

    final user = await AuthService.getUser();
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please sign in to continue')),
      );
      return;
    }

    try {
      final request = CustomTourRequest(
        userEmail: user.email ?? '',
        userName: '${user.fName ?? ''} ${user.lName ?? ''}',
        startDate: DateFormat('yyyy-MM-dd').format(_startDate),
        endDate: _endDate != null
            ? DateFormat('yyyy-MM-dd').format(_endDate!)
            : DateFormat('yyyy-MM-dd').format(_startDate),
        destinations: _selectedDestinations
            .map((d) => {'id': d.id, 'name': d.name, 'order': d.order})
            .toList(),
        hotels: _selectedHotels
            .map((h) => {'id': h.id, 'name': h.name})
            .toList(),
        flights: _selectedFlights.entries.map((entry) {
          final flight = entry.value;
          final itinerary = flight.itineraries.first;
          final firstSegment = itinerary.segments.first;
          final lastSegment = itinerary.segments.last;

          return {
            'segment_index': entry.key,
            'flight_offer_id': flight.id,
            'origin_airport_code': firstSegment.departure.iataCode,
            'origin_airport_name': '${firstSegment.departure.iataCode} Airport',
            'destination_airport_code': lastSegment.arrival.iataCode,
            'destination_airport_name':
                '${lastSegment.arrival.iataCode} Airport',
            'departure_datetime': firstSegment.departure.at,
            'arrival_datetime': lastSegment.arrival.at,
            'duration': itinerary.duration,
            'number_of_stops': itinerary.segments.length - 1,
            'airline_code': firstSegment.carrierCode,
            'flight_number': firstSegment.number,
            'price_amount': double.parse(flight.price.total),
            'price_currency': flight.price.currency,
          };
        }).toList(),
        numberOfPersons: _numberOfPersons,
        proposedPrice: _proposedPrice,
        minimumPrice: _minimumPrice,
        estimatedHotelCost: _selectedHotels.fold<double>(
          0,
          (sum, h) =>
              sum + (h.pricePerNight ?? 100) * _selectedDestinations.length,
        ),
        totalFlightCost: _selectedFlights.values.fold<double>(
          0,
          (sum, f) => sum + double.parse(f.price.total),
        ),
        notes: _notes.isNotEmpty ? _notes : null,
      );

      await customTourService.submitCustomTourRequest(request);

      if (mounted) {
        Navigator.pop(context); // Close booking form
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Success!'),
            content: const Text(
              'Custom tour request submitted successfully! '
              'Our team will review your request and contact you within 24-48 hours.',
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.pop(context); // Go back to previous screen
                },
                child: const Text('OK'),
              ),
            ],
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Failed to submit request: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Custom Tour Builder'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Destinations'),
            Tab(text: 'Hotels'),
            Tab(text: 'Flights'),
          ],
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Map Section with collapse button
                if (_selectedDestinations.isNotEmpty) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    child: ElevatedButton.icon(
                      onPressed: () =>
                          setState(() => _isMapCollapsed = !_isMapCollapsed),
                      icon: Icon(
                        _isMapCollapsed ? Icons.expand_more : Icons.expand_less,
                      ),
                      label: Text(_isMapCollapsed ? 'Show Map' : 'Hide Map'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _isMapCollapsed
                            ? Colors.grey[300]
                            : Theme.of(context).primaryColor,
                        foregroundColor: _isMapCollapsed
                            ? Colors.black87
                            : Colors.white,
                      ),
                    ),
                  ),
                  if (!_isMapCollapsed)
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      height: 250,
                      child: _buildMap(),
                    ),
                ],
                // Tab View
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _buildDestinationsTab(),
                      _buildHotelsTab(),
                      _buildFlightsTab(),
                    ],
                  ),
                ),
              ],
            ),
      floatingActionButton: _selectedDestinations.isNotEmpty
          ? FloatingActionButton.extended(
              onPressed: _showBookingForm,
              icon: const Icon(Icons.send),
              label: const Text('Book Tour'),
            )
          : null,
      bottomNavigationBar: _selectedDestinations.isNotEmpty
          ? Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.3),
                    spreadRadius: 1,
                    blurRadius: 5,
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Estimated From:',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                      Text(
                        'DA ${_minimumPrice.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                    ],
                  ),
                  Text(
                    '${_selectedDestinations.length} dest • ${_selectedHotels.length} hotels',
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                ],
              ),
            )
          : null,
    );
  }

  Widget _buildMap() {
    final coordinates = _selectedDestinations
        .where((d) => d.latitude != null && d.longitude != null)
        .map((d) => LatLng(d.latitude!, d.longitude!))
        .toList();

    if (coordinates.isEmpty) {
      return Container(
        color: Colors.grey[200],
        child: const Center(child: Text('No map data available')),
      );
    }

    return FlutterMap(
      options: MapOptions(initialCenter: coordinates.first, initialZoom: 6.0),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.tourz.app',
        ),
        MarkerLayer(
          markers: _selectedDestinations
              .where((d) => d.latitude != null && d.longitude != null)
              .map((d) {
                final isStart = d.order == 1;
                final isEnd = d.order == _selectedDestinations.length;
                final color = isStart
                    ? Colors.green
                    : isEnd
                    ? Colors.red
                    : Colors.blue;

                return Marker(
                  point: LatLng(d.latitude!, d.longitude!),
                  width: 40,
                  height: 40,
                  child: Icon(Icons.location_on, color: color, size: 40),
                );
              })
              .toList(),
        ),
        PolylineLayer(
          polylines: [
            if (coordinates.length > 1)
              Polyline(
                points: coordinates,
                strokeWidth: 3.0,
                color: Colors.blue,
              ),
          ],
        ),
      ],
    );
  }

  Widget _buildDestinationsTab() {
    return Column(
      children: [
        Expanded(
          child: _selectedDestinations.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.place, size: 80, color: Colors.grey[400]),
                      const SizedBox(height: 16),
                      Text(
                        'No destinations added yet',
                        style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton.icon(
                        onPressed: _showDestinationPicker,
                        icon: const Icon(Icons.add),
                        label: const Text('Add Destination'),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  itemCount: _selectedDestinations.length,
                  itemBuilder: (context, index) {
                    final dest = _selectedDestinations[index];
                    return DestinationCard(
                      destination: dest,
                      isSelected: true,
                      order: dest.order,
                      onRemove: () => _removeDestination(dest.id),
                    );
                  },
                ),
        ),
        if (_selectedDestinations.isNotEmpty)
          Padding(
            padding: const EdgeInsets.all(16),
            child: ElevatedButton.icon(
              onPressed: _showDestinationPicker,
              icon: const Icon(Icons.add),
              label: const Text('Add More Destinations'),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 48),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildHotelsTab() {
    return Column(
      children: [
        if (_selectedDestinations.isEmpty)
          const Expanded(
            child: Center(child: Text('Please add destinations first')),
          )
        else ...[
          Expanded(
            child: _selectedHotels.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.hotel, size: 64, color: Colors.grey[400]),
                        const SizedBox(height: 12),
                        Text(
                          'No hotels selected',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: _showHotelPicker,
                          icon: const Icon(Icons.add),
                          label: const Text('Add Hotel'),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    itemCount: _selectedHotels.length,
                    itemBuilder: (context, index) {
                      final hotel = _selectedHotels[index];
                      return HotelCard(
                        hotel: hotel,
                        isSelected: true,
                        onRemove: () => _removeHotel(hotel.id),
                      );
                    },
                  ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: ElevatedButton.icon(
              onPressed: _showHotelPicker,
              icon: const Icon(Icons.add),
              label: Text(
                _selectedHotels.isEmpty ? 'Add Hotel' : 'Add More Hotels',
              ),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 48),
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildFlightsTab() {
    if (_flightSegments.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.flight_takeoff, size: 80, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No flights needed',
              style: TextStyle(fontSize: 18, color: Colors.grey[600]),
            ),
            const SizedBox(height: 8),
            Text(
              'Select destinations from different countries\nto see available flights',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: Colors.grey[500]),
            ),
          ],
        ),
      );
    }

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          color: Colors.blue[50],
          child: const Row(
            children: [
              Icon(Icons.info_outline, color: Colors.blue),
              SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Select one flight option per segment for your booking',
                  style: TextStyle(fontSize: 14),
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: _loadingFlights
              ? const Center(child: CircularProgressIndicator())
              : ListView.builder(
                  itemCount: _flightSegments.length,
                  itemBuilder: (context, segmentIndex) {
                    final segment = _flightSegments[segmentIndex];
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(16),
                          color: Colors.grey[200],
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.blue,
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Text(
                                  'Segment ${segmentIndex + 1}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  '${segment.originAirport.address.cityName} → '
                                  '${segment.destinationAirport.address.cityName}',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        ...segment.flightOffers.take(3).map((offer) {
                          final isSelected =
                              _selectedFlights[segment.segmentIndex]?.id ==
                              offer.id;
                          return FlightCard(
                            flightOffer: offer,
                            isSelected: isSelected,
                            onSelect: () {
                              setState(() {
                                _selectedFlights[segment.segmentIndex] = offer;
                              });
                            },
                          );
                        }),
                      ],
                    );
                  },
                ),
        ),
      ],
    );
  }
}
