import 'package:flutter/material.dart';
import 'dart:ui';
import 'package:TOURZ/models/tour.dart';
import 'package:TOURZ/services/api_service.dart';
import 'package:TOURZ/widgets/horizontal_place_item.dart';
import 'package:TOURZ/screens/destination_details_screen.dart';
import 'package:skeletonizer/skeletonizer.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  List<Tour> tours = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    fetchTours();
  }

  @override
  void dispose() {
    super.dispose();
  }

  Future<void> fetchTours() async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = null;
      });

      final fetchedTours = await ApiService.fetchTours(active: true);

      setState(() {
        tours = fetchedTours;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to load tours: $e';
        isLoading = false;
      });
      print('Error fetching tours: $e');
    }
  }

  // Create fake tours for skeleton loading
  List<Tour> get _fakeTours => List.generate(
    5,
    (index) => Tour(
      id: index,
      type: 'group',
      title: 'Loading Title Placeholder',
      description: 'Loading description placeholder text',
      price: 999.0,
      durationDays: 5,
      difficultyLevel: 'medium',
      isActive: true,
      isEcoFriendly: true,
      destinations: [
        TourDestination(
          id: index,
          name: 'Loading Destination',
          city: 'Loading City',
          country: 'Loading Country',
          daysAtDestination: 2,
          order: 1,
          imageUrl: 'https://via.placeholder.com/150',
        ),
      ],
    ),
  );

  @override
  Widget build(BuildContext context) {
    // Use fake tours for loading state
    final displayTours = isLoading ? _fakeTours : tours;

    // We update the local tours variable to show skeletons if loading
    // But be careful not to overwrite the actual state variable 'tours' permanently in build
    // A better approach is to use a local variable for the list passed to widgets

    return Scaffold(
      body: errorMessage != null
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
                  ElevatedButton(onPressed: fetchTours, child: Text('Retry')),
                ],
              ),
            )
          : Skeletonizer(
              enabled: isLoading,
              child: RefreshIndicator(
                onRefresh: fetchTours,
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Padding for header
                      SizedBox(height: MediaQuery.of(context).padding.top + 72),

                      // Custom Tour Banner (Hero Section)
                      _buildCustomTourBanner(),

                      SizedBox(height: 32),

                      // Popular Destinations Section
                      _buildPopularDestinations(displayTours),

                      SizedBox(height: 32),

                      // Top Rated Tours Section
                      _buildTopRatedTours(displayTours),

                      SizedBox(height: 100), // Space for nav bar
                    ],
                  ),
                ),
              ),
            ),
    );
  }

  // Custom Tour Banner - Hero Section with Glass Morphism
  Widget _buildCustomTourBanner() {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 20),
      height: 200,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Theme.of(context).primaryColor.withOpacity(0.3),
            blurRadius: 30,
            spreadRadius: 5,
            offset: Offset(0, 10),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Background Image
            Image.network(
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Theme.of(context).primaryColor,
                        Theme.of(context).primaryColor.withOpacity(0.7),
                      ],
                    ),
                  ),
                );
              },
            ),
            // Glass morphism overlay
            BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 2, sigmaY: 2),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Theme.of(context).primaryColor.withOpacity(0.7),
                      Theme.of(context).primaryColor.withOpacity(0.5),
                    ],
                  ),
                ),
              ),
            ),
            // Glow border
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: Colors.white.withOpacity(0.3),
                  width: 1.5,
                ),
              ),
            ),
            // Content
            Padding(
              padding: EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.edit_calendar, color: Colors.white, size: 36),
                  SizedBox(height: 10),
                  Flexible(
                    child: Text(
                      'Create Your Custom Tour',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  SizedBox(height: 6),
                  Flexible(
                    child: Text(
                      'Design your perfect journey',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontSize: 13,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Custom tour builder coming soon!'),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Theme.of(context).primaryColor,
                      padding: EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 10,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 5,
                    ),
                    child: Text(
                      'Start Planning',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Popular Destinations Section
  Widget _buildPopularDestinations(List<Tour> tours) {
    // Extract unique destinations from tours
    final destinations = <String, Map<String, dynamic>>{};

    for (var tour in tours) {
      if (tour.destinations != null && tour.destinations!.isNotEmpty) {
        final dest = tour.destinations!.first;
        final key = '${dest.city}, ${dest.country}';
        if (!destinations.containsKey(key)) {
          destinations[key] = {
            'city': dest.city,
            'country': dest.country,
            'image': dest.imageUrl,
            'count': 1,
          };
        } else {
          destinations[key]!['count'] += 1;
        }
      }
    }

    final destList = destinations.values.toList()..take(6);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Popular Destinations',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 4),
              Text(
                'Discover amazing places around the world',
                style: TextStyle(color: Colors.grey[600], fontSize: 14),
              ),
            ],
          ),
        ),
        SizedBox(height: 16),
        SizedBox(
          height: 160,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.symmetric(horizontal: 20),
            itemCount: destList.length,
            itemBuilder: (context, index) {
              final dest = destList[index];
              return _buildDestinationCard(
                city: dest['city'],
                country: dest['country'],
                imageUrl: dest['image'],
                tourCount: dest['count'],
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDestinationCard({
    required String city,
    required String country,
    required String imageUrl,
    required int tourCount,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => DestinationDetailsScreen(
              city: city,
              country: country,
              imageUrl: imageUrl,
            ),
          ),
        );
      },
      child: Container(
        width: 140,
        margin: EdgeInsets.only(right: 16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Background Image
              Image.network(
                imageUrl.replaceAll('localhost', '192.168.1.26'),
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    color: Colors.grey[300],
                    child: Icon(Icons.landscape, size: 40),
                  );
                },
              ),
              // Gradient Overlay
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.transparent, Colors.black.withOpacity(0.7)],
                  ),
                ),
              ),
              // Text Content
              Positioned(
                bottom: 12,
                left: 12,
                right: 12,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      city,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: 2),
                    Text(
                      '$tourCount tours',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Top Rated Tours Section
  Widget _buildTopRatedTours(List<Tour> tours) {
    final topTours = tours.take(3).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Top Rated Tours',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Most popular tours this month',
                    style: TextStyle(color: Colors.grey[600], fontSize: 14),
                  ),
                ],
              ),
            ],
          ),
        ),
        SizedBox(height: 16),
        SizedBox(
          height: 240,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.symmetric(horizontal: 20),
            itemCount: topTours.length,
            itemBuilder: (context, index) {
              final tour = topTours[index];
              return HorizontalPlaceItem(place: tour.toJson());
            },
          ),
        ),
      ],
    );
  }
}

// Pattern Painter for banner background
class PatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;

    for (var i = 0; i < 10; i++) {
      canvas.drawCircle(
        Offset(size.width * 0.1 * i, size.height * 0.5),
        20,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
