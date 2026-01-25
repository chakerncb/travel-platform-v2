import 'package:flutter/material.dart';
import 'package:TOURZ/models/tour.dart';
import 'package:TOURZ/services/api_service.dart';
import 'package:TOURZ/widgets/vertical_place_item.dart';
import 'package:skeletonizer/skeletonizer.dart';

class DestinationDetailsScreen extends StatefulWidget {
  final String city;
  final String country;
  final String imageUrl;

  const DestinationDetailsScreen({
    Key? key,
    required this.city,
    required this.country,
    required this.imageUrl,
  }) : super(key: key);

  @override
  _DestinationDetailsScreenState createState() =>
      _DestinationDetailsScreenState();
}

class _DestinationDetailsScreenState extends State<DestinationDetailsScreen> {
  List<Tour> tours = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    fetchDestinationTours();
  }

  Future<void> fetchDestinationTours() async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = null;
      });

      final allTours = await ApiService.fetchTours(active: true);

      // Filter tours that have this destination
      final filteredTours = allTours.where((tour) {
        if (tour.destinations == null) return false;
        return tour.destinations!.any(
          (dest) => dest.city == widget.city && dest.country == widget.country,
        );
      }).toList();

      setState(() {
        tours = filteredTours;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to load tours: $e';
        isLoading = false;
      });
    }
  }

  // Create fake tours for skeleton loading
  List<Tour> get _fakeTours => List.generate(
    3,
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
          city: widget.city, // Use real city to match validation if needed
          country: widget.country,
          daysAtDestination: 2,
          order: 1,
          imageUrl: widget.imageUrl,
        ),
      ],
    ),
  );

  @override
  Widget build(BuildContext context) {
    // Only use fake tours if loading. If loaded but empty, we show empty state message.
    final displayTours = isLoading ? _fakeTours : tours;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App Bar with Image
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                widget.city,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  shadows: [
                    Shadow(
                      color: Colors.black.withOpacity(0.5),
                      blurRadius: 10,
                    ),
                  ],
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    widget.imageUrl.replaceAll('localhost', '192.168.1.26'),
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: Theme.of(context).primaryColor,
                        child: Icon(
                          Icons.landscape,
                          size: 100,
                          color: Colors.white,
                        ),
                      );
                    },
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withOpacity(0.7),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Destination Info
                  Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        color: Theme.of(context).primaryColor,
                        size: 24,
                      ),
                      SizedBox(width: 8),
                      Text(
                        '${widget.city}, ${widget.country}',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Skeletonizer(
                    enabled: isLoading,
                    child: Text(
                      isLoading
                          ? 'Loading tours available...'
                          : '${tours.length} ${tours.length == 1 ? 'tour' : 'tours'} available',
                      style: TextStyle(color: Colors.grey[600], fontSize: 14),
                    ),
                  ),
                  SizedBox(height: 24),

                  // Tours Section
                  Text(
                    'Available Tours',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Explore tours in ${widget.city}',
                    style: TextStyle(color: Colors.grey[600], fontSize: 14),
                  ),
                  SizedBox(height: 16),
                ],
              ),
            ),
          ),

          // Tours List
          errorMessage != null
              ? SliverToBoxAdapter(
                  child: Center(
                    child: Padding(
                      padding: EdgeInsets.all(40),
                      child: Text(
                        errorMessage!,
                        style: TextStyle(color: Colors.red),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                )
              : !isLoading && tours.isEmpty
              ? SliverToBoxAdapter(
                  child: Center(
                    child: Padding(
                      padding: EdgeInsets.all(40),
                      child: Text('No tours found in ${widget.city}'),
                    ),
                  ),
                )
              : Skeletonizer.sliver(
                  enabled: isLoading,
                  child: SliverPadding(
                    padding: EdgeInsets.only(left: 20, right: 20, bottom: 100),
                    sliver: SliverList(
                      delegate: SliverChildBuilderDelegate((context, index) {
                        return VerticalPlaceItem(
                          place: displayTours[index].toJson(),
                        );
                      }, childCount: displayTours.length),
                    ),
                  ),
                ),
        ],
      ),
    );
  }
}
