import 'package:flutter/material.dart';
import 'package:TOURZ/models/tour.dart';
import 'package:TOURZ/services/api_service.dart';
import 'package:TOURZ/widgets/vertical_place_item.dart';
import 'package:skeletonizer/skeletonizer.dart';

class AllToursScreen extends StatefulWidget {
  const AllToursScreen({Key? key}) : super(key: key);

  @override
  _AllToursScreenState createState() => _AllToursScreenState();
}

class _AllToursScreenState extends State<AllToursScreen> {
  List<Tour> tours = [];
  List<Tour> filteredTours = [];
  bool isLoading = true;
  String? errorMessage;
  TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchTours();
  }

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  Future<void> fetchTours() async {
    try {
      if (mounted) {
        setState(() {
          isLoading = true;
          errorMessage = null;
        });
      }

      final fetchedTours = await ApiService.fetchTours(active: true);

      if (mounted) {
        setState(() {
          tours = fetchedTours;
          filteredTours = fetchedTours;
          isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          errorMessage = 'Failed to load tours: $e';
          isLoading = false;
        });
      }
    }
  }

  void _filterTours(String query) {
    setState(() {
      if (query.isEmpty) {
        filteredTours = tours;
      } else {
        filteredTours = tours.where((tour) {
          final titleMatch = tour.title.toLowerCase().contains(
            query.toLowerCase(),
          );
          final descMatch = tour.description.toLowerCase().contains(
            query.toLowerCase(),
          );
          final destMatch =
              tour.destinations?.any(
                (dest) =>
                    dest.city.toLowerCase().contains(query.toLowerCase()) ||
                    dest.country.toLowerCase().contains(query.toLowerCase()),
              ) ??
              false;
          return titleMatch || descMatch || destMatch;
        }).toList();
      }
    });
  }

  // Create fake tours for skeleton loading
  List<Tour> get _fakeTours => List.generate(
    5,
    (index) => Tour(
      id: index,
      type: 'group',
      title: 'Loading tour title here placeholder text',
      description:
          'Loading description text that will be replaced with real content from the server when data loads',
      price: 999.0,
      durationDays: 5,
      difficultyLevel: 'moderate',
      isActive: true,
      isEcoFriendly: true,
    ),
  );

  @override
  Widget build(BuildContext context) {
    final displayTours = isLoading ? _fakeTours : filteredTours;

    return Scaffold(
      body: Padding(
        padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top + 72),
        child: Column(
          children: [
            // Search Bar
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: TextField(
                controller: searchController,
                onChanged: _filterTours,
                enabled: !isLoading,
                decoration: InputDecoration(
                  hintText: 'Search tours...',
                  prefixIcon: Icon(Icons.search),
                  suffixIcon: searchController.text.isNotEmpty
                      ? IconButton(
                          icon: Icon(Icons.clear),
                          onPressed: () {
                            searchController.clear();
                            _filterTours('');
                          },
                        )
                      : null,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  filled: true,
                  fillColor: Colors.grey[100],
                ),
              ),
            ),

            // Results count
            if (!isLoading)
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${filteredTours.length} ${filteredTours.length == 1 ? 'Tour' : 'Tours'}',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (searchController.text.isNotEmpty)
                      TextButton(
                        onPressed: () {
                          searchController.clear();
                          _filterTours('');
                        },
                        child: Text('Clear Filter'),
                      ),
                  ],
                ),
              ),

            SizedBox(height: 8),

            // Tours List with Skeleton Loading
            Expanded(
              child: errorMessage != null
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.error_outline,
                            size: 60,
                            color: Colors.red,
                          ),
                          SizedBox(height: 16),
                          Text(
                            errorMessage!,
                            style: TextStyle(color: Colors.red),
                            textAlign: TextAlign.center,
                          ),
                          SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: fetchTours,
                            child: Text('Retry'),
                          ),
                        ],
                      ),
                    )
                  : displayTours.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.search_off, size: 60, color: Colors.grey),
                          SizedBox(height: 16),
                          Text(
                            searchController.text.isNotEmpty
                                ? 'No tours found'
                                : 'No tours available',
                            style: TextStyle(fontSize: 18, color: Colors.grey),
                          ),
                        ],
                      ),
                    )
                  : Skeletonizer(
                      enabled: isLoading,
                      child: RefreshIndicator(
                        onRefresh: fetchTours,
                        child: ListView.builder(
                          padding: EdgeInsets.only(
                            left: 20,
                            right: 20,
                            bottom: 100,
                          ),
                          itemCount: displayTours.length,
                          itemBuilder: (context, index) {
                            return VerticalPlaceItem(
                              place: displayTours[index].toJson(),
                            );
                          },
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
