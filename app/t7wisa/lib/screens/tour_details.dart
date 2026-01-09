import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart' hide Marker;
import 'package:t7wisa/models/tour.dart';
import 'package:t7wisa/services/api_service.dart';
import 'package:t7wisa/widgets/icon_badge.dart';
import 'package:t7wisa/screens/booking_screen.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class Details extends StatefulWidget {
  final int tourId;

  const Details({Key? key, required this.tourId}) : super(key: key);

  @override
  _DetailsState createState() => _DetailsState();
}

class _DetailsState extends State<Details> {
  Tour? tour;
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    fetchTourDetails();
  }

  Future<void> fetchTourDetails() async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = null;
      });

      final fetchedTour = await ApiService.fetchTourById(widget.tourId);

      setState(() {
        tour = fetchedTour;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to load tour details: $e';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        actions: <Widget>[
          IconButton(
            icon: IconBadge(icon: Icons.notifications_none),
            onPressed: () {},
          ),
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : errorMessage != null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    errorMessage!,
                    style: TextStyle(color: Colors.red),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: fetchTourDetails,
                    child: Text('Retry'),
                  ),
                ],
              ),
            )
          : tour == null
          ? Center(child: Text('Tour not found'))
          : RefreshIndicator(
              onRefresh: fetchTourDetails,
              child: ListView(
                children: <Widget>[
                  SizedBox(height: 10.0),
                  buildMapView(),
                  SizedBox(height: 20),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        buildHeader(),
                        SizedBox(height: 20),
                        buildInfoCards(),
                        SizedBox(height: 30),
                        buildSection(
                          'Overview',
                          Html(
                            data: tour!.description,
                            style: {
                              "p": Style(
                                fontSize: FontSize(15),
                                lineHeight: LineHeight(1.6),
                              ),
                            },
                          ),
                        ),
                        if (tour!.destinations != null &&
                            tour!.destinations!.isNotEmpty)
                          buildDestinationsSection(),
                        if (tour!.hotels != null && tour!.hotels!.isNotEmpty)
                          buildHotelsSection(),
                        if (tour!.includedServices != null &&
                            tour!.includedServices!.isNotEmpty)
                          buildServicesSection(
                            'Included Services',
                            tour!.includedServices!,
                            Colors.green,
                          ),
                        if (tour!.excludedServices != null &&
                            tour!.excludedServices!.isNotEmpty)
                          buildServicesSection(
                            'Excluded Services',
                            tour!.excludedServices!,
                            Colors.red,
                          ),
                        SizedBox(height: 20),
                      ],
                    ),
                  ),
                ],
              ),
            ),
      floatingActionButton: tour != null
          ? FloatingActionButton.extended(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => BookingScreen(tour: tour!),
                  ),
                );
              },
              icon: Icon(Icons.airplanemode_active),
              label: Text('Book Now'),
            )
          : null,
    );
  }

  Widget buildMapView() {
    if (tour!.destinations == null || tour!.destinations!.isEmpty) {
      return Container(
        margin: EdgeInsets.symmetric(horizontal: 20),
        height: 300,
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: BorderRadius.circular(16),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.map_outlined, size: 60, color: Colors.grey[600]),
              SizedBox(height: 8),
              Text(
                'No destinations available',
                style: TextStyle(color: Colors.grey[600]),
              ),
            ],
          ),
        ),
      );
    }

    // Get destinations with valid coordinates
    final destinationsWithCoords = tour!.destinations!
        .where((d) => d.latitude != null && d.longitude != null)
        .toList();

    if (destinationsWithCoords.isEmpty) {
      return Container(
        margin: EdgeInsets.symmetric(horizontal: 20),
        height: 300,
        decoration: BoxDecoration(
          color: Colors.grey[300],
          borderRadius: BorderRadius.circular(16),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.location_off, size: 60, color: Colors.grey[600]),
              SizedBox(height: 8),
              Text(
                'Location data not available',
                style: TextStyle(color: Colors.grey[600]),
              ),
            ],
          ),
        ),
      );
    }

    // Calculate center and bounds
    final latitudes = destinationsWithCoords.map((d) => d.latitude!).toList();
    final longitudes = destinationsWithCoords.map((d) => d.longitude!).toList();

    final centerLat = (latitudes.reduce((a, b) => a + b)) / latitudes.length;
    final centerLng = (longitudes.reduce((a, b) => a + b)) / longitudes.length;

    return Container(
      margin: EdgeInsets.symmetric(horizontal: 20),
      height: 300,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: FlutterMap(
          options: MapOptions(
            initialCenter: LatLng(centerLat, centerLng),
            initialZoom: destinationsWithCoords.length == 1 ? 12.0 : 6.0,
            interactionOptions: InteractionOptions(
              flags: InteractiveFlag.all & ~InteractiveFlag.rotate,
            ),
          ),
          children: [
            TileLayer(
              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              userAgentPackageName: 'com.t7wisa.app',
            ),
            // Draw route line
            if (destinationsWithCoords.length > 1)
              PolylineLayer(
                polylines: [
                  Polyline(
                    points: destinationsWithCoords
                        .map((d) => LatLng(d.latitude!, d.longitude!))
                        .toList(),
                    color: Colors.blue.withOpacity(0.7),
                    strokeWidth: 3.0,
                    borderColor: Colors.white,
                    borderStrokeWidth: 1.0,
                  ),
                ],
              ),
            // Draw markers
            MarkerLayer(
              markers: destinationsWithCoords.asMap().entries.map((entry) {
                final index = entry.key;
                final dest = entry.value;
                final isFirst = index == 0;
                final isLast = index == destinationsWithCoords.length - 1;

                Color markerColor = Colors.blue;
                String label = '${index + 1}';

                if (isFirst) {
                  markerColor = Colors.green;
                  label = 'S';
                } else if (isLast) {
                  markerColor = Colors.red;
                  label = 'E';
                }

                return Marker(
                  point: LatLng(dest.latitude!, dest.longitude!),
                  width: 40,
                  height: 50,
                  child: GestureDetector(
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          title: Text(dest.name),
                          content: Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${dest.city}, ${dest.country}',
                                style: TextStyle(fontWeight: FontWeight.w500),
                              ),
                              SizedBox(height: 8),
                              Text(
                                '${dest.daysAtDestination} ${dest.daysAtDestination == 1 ? 'day' : 'days'}',
                                style: TextStyle(color: Colors.blue[700]),
                              ),
                            ],
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: Text('Close'),
                            ),
                          ],
                        ),
                      );
                    },
                    child: Column(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: markerColor,
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 3),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black26,
                                blurRadius: 4,
                                offset: Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Center(
                            child: Text(
                              label,
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ),
                        ),
                        Container(
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: markerColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget buildHeader() {
    final firstDestination = tour!.destinations?.isNotEmpty == true
        ? tour!.destinations!.first
        : null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                tour!.title,
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 24),
              ),
            ),
            IconButton(icon: Icon(Icons.bookmark_border), onPressed: () {}),
          ],
        ),
        if (firstDestination != null) ...[
          SizedBox(height: 8),
          Row(
            children: [
              Icon(Icons.location_on, size: 16, color: Colors.blueGrey[300]),
              SizedBox(width: 5),
              Expanded(
                child: Text(
                  '${firstDestination.city}, ${firstDestination.country}',
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 14,
                    color: Colors.blueGrey[300],
                  ),
                ),
              ),
            ],
          ),
        ],
        SizedBox(height: 16),
        Row(
          children: [
            Container(
              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: tour!.isEcoFriendly ? Colors.green[50] : Colors.blue[50],
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  Icon(
                    tour!.isEcoFriendly ? Icons.eco : Icons.tour,
                    size: 16,
                    color: tour!.isEcoFriendly ? Colors.green : Colors.blue,
                  ),
                  SizedBox(width: 5),
                  Text(
                    tour!.isEcoFriendly ? 'Eco-Friendly' : tour!.type,
                    style: TextStyle(
                      fontSize: 12,
                      color: tour!.isEcoFriendly ? Colors.green : Colors.blue,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(width: 10),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.orange[50],
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                tour!.difficultyLevel.toUpperCase(),
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.orange[700],
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
        SizedBox(height: 16),
        Text(
          'DZD ${tour!.price.toStringAsFixed(0)}',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 28,
            color: Colors.blue[700],
          ),
        ),
      ],
    );
  }

  Widget buildInfoCards() {
    return Row(
      children: [
        Expanded(
          child: _buildInfoCard(
            Icons.calendar_today,
            'Duration',
            '${tour!.durationDays} Days',
            Colors.blue,
          ),
        ),
        SizedBox(width: 12),
        Expanded(
          child: _buildInfoCard(
            Icons.people,
            'Group Size',
            '${tour!.maxGroupSize ?? 'N/A'}',
            Colors.green,
          ),
        ),
        SizedBox(width: 12),
        Expanded(
          child: _buildInfoCard(
            Icons.star,
            'Rating',
            tour!.averageRating != null
                ? tour!.averageRating!.toStringAsFixed(1)
                : 'N/A',
            Colors.orange,
          ),
        ),
      ],
    );
  }

  Widget _buildInfoCard(
    IconData icon,
    String label,
    String value,
    Color color,
  ) {
    return Container(
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 28),
          SizedBox(height: 8),
          Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[600])),
          SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget buildSection(String title, Widget content) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
        ),
        SizedBox(height: 12),
        content,
        SizedBox(height: 20),
      ],
    );
  }

  Widget buildDestinationsSection() {
    return buildSection(
      'Destinations (${tour!.destinations!.length})',
      Column(
        children: tour!.destinations!.map((destination) {
          return Card(
            margin: EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.blue[100],
                child: Text(
                  '${destination.order}',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
              title: Text(
                destination.name,
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${destination.city}, ${destination.country}'),
                  SizedBox(height: 4),
                  Text(
                    '${destination.daysAtDestination} ${destination.daysAtDestination == 1 ? 'day' : 'days'}',
                    style: TextStyle(
                      color: Colors.blue[700],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              trailing: Icon(Icons.location_on, color: Colors.red),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget buildHotelsSection() {
    return buildSection(
      'Hotels (${tour!.hotels!.length})',
      Column(
        children: tour!.hotels!.map((hotel) {
          return Card(
            margin: EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: Icon(Icons.hotel, color: Colors.blue[700], size: 32),
              title: Text(
                hotel.name,
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${hotel.city}, ${hotel.country}'),
                  SizedBox(height: 4),
                  Row(
                    children: [
                      if (hotel.starRating != null) ...[
                        ...List.generate(
                          hotel.starRating!,
                          (index) =>
                              Icon(Icons.star, size: 16, color: Colors.amber),
                        ),
                        SizedBox(width: 8),
                      ],
                      Text(
                        '${hotel.nights} ${hotel.nights == 1 ? 'night' : 'nights'}',
                        style: TextStyle(
                          color: Colors.blue[700],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget buildServicesSection(
    String title,
    List<String> services,
    Color color,
  ) {
    return buildSection(
      title,
      Column(
        children: services.map((service) {
          return Padding(
            padding: EdgeInsets.only(bottom: 8),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  color == Colors.green ? Icons.check_circle : Icons.cancel,
                  color: color,
                  size: 20,
                ),
                SizedBox(width: 10),
                Expanded(child: Text(service, style: TextStyle(fontSize: 15))),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}
