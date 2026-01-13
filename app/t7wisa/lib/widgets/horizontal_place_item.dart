import 'package:flutter/material.dart';
import 'dart:ui';
import '../screens/tour_details.dart';

class HorizontalPlaceItem extends StatelessWidget {
  final Map place;

  const HorizontalPlaceItem({super.key, required this.place});

  String _getImageUrl() {
    if (place['destinations'] != null &&
        (place['destinations'] as List).isNotEmpty) {
      return place['destinations'][0]['image_url'] ?? '';
    }
    return '';
  }

  String _getLocation() {
    if (place['destinations'] != null &&
        (place['destinations'] as List).isNotEmpty) {
      final dest = place['destinations'][0];
      return '${dest['city']}, ${dest['country']}';
    }
    return '';
  }

  @override
  Widget build(BuildContext context) {
    final imageUrl = _getImageUrl();

    return Padding(
      padding: const EdgeInsets.only(right: 16.0),
      child: GestureDetector(
        onTap: () {
          final tourId = place['id'] as int;
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (BuildContext context) {
                return Details(tourId: tourId);
              },
            ),
          );
        },
        child: Container(
          width: 200.0,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.15),
                blurRadius: 20,
                offset: Offset(0, 10),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: Stack(
              children: [
                // Background Image
                imageUrl.isNotEmpty
                    ? Image.network(
                        imageUrl.replaceAll('localhost', '10.0.2.2'),
                        height: 220.0,
                        width: 200.0,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            height: 220.0,
                            width: 200.0,
                            color: Colors.grey[300],
                            child: Icon(Icons.image_not_supported, size: 50),
                          );
                        },
                      )
                    : Container(
                        height: 220.0,
                        width: 200.0,
                        color: Colors.grey[300],
                        child: Icon(Icons.landscape, size: 50),
                      ),
                // Gradient Overlay
                Container(
                  height: 220.0,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Colors.black.withOpacity(0.8),
                      ],
                      stops: [0.5, 1.0],
                    ),
                  ),
                ),
                // Glassmorphic Info Card
                Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  child: ClipRRect(
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                      child: Container(
                        padding: EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.white.withOpacity(0.15),
                              Colors.white.withOpacity(0.05),
                            ],
                          ),
                          border: Border(
                            top: BorderSide(
                              color: Colors.white.withOpacity(0.2),
                              width: 1,
                            ),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              "${place['title'] ?? 'Unknown Tour'}",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16.0,
                                color: Colors.white,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            SizedBox(height: 4.0),
                            Row(
                              children: [
                                Icon(
                                  Icons.location_on,
                                  size: 14,
                                  color: Colors.white70,
                                ),
                                SizedBox(width: 4),
                                Expanded(
                                  child: Text(
                                    _getLocation(),
                                    style: TextStyle(
                                      fontSize: 12.0,
                                      color: Colors.white70,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
                // Eco Badge
                if (place['is_eco_friendly'] == true)
                  Positioned(
                    top: 12,
                    right: 12,
                    child: Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.9),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: Colors.white.withOpacity(0.3),
                          width: 1.5,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 8,
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.eco, size: 14, color: Colors.white),
                          SizedBox(width: 4),
                          Text(
                            'Eco',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
