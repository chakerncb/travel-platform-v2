import 'package:flutter/material.dart';
import 'dart:ui';
import '../screens/tour_details.dart';

class VerticalPlaceItem extends StatelessWidget {
  final Map place;

  VerticalPlaceItem({required this.place});

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

  String _getFormattedPrice() {
    final price = double.tryParse(place['price']?.toString() ?? '0') ?? 0;
    final days = place['duration_days'] ?? 1;
    return '${price.toStringAsFixed(0)} DA /${days}d';
  }

  @override
  Widget build(BuildContext context) {
    final imageUrl = _getImageUrl();

    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
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
          height: 120.0,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 15,
                offset: Offset(0, 5),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Stack(
              children: [
                // Background Image
                Row(
                  children: [
                    imageUrl.isNotEmpty
                        ? Image.network(
                            imageUrl.replaceAll('localhost', '10.0.2.2'),
                            height: 120.0,
                            width: 120.0,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                height: 120.0,
                                width: 120.0,
                                color: Colors.grey[300],
                                child: Icon(Icons.image_not_supported),
                              );
                            },
                          )
                        : Container(
                            height: 120.0,
                            width: 120.0,
                            color: Colors.grey[300],
                            child: Icon(Icons.landscape),
                          ),
                    Expanded(
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                            colors: [
                              Colors.white.withOpacity(0.95),
                              Colors.white.withOpacity(0.98),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                // Glassmorphic Content Overlay
                Row(
                  children: [
                    SizedBox(width: 120),
                    Expanded(
                      child: ClipRRect(
                        child: BackdropFilter(
                          filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                          child: Container(
                            padding: EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  Colors.white.withOpacity(0.3),
                                  Colors.white.withOpacity(0.1),
                                ],
                              ),
                              border: Border(
                                left: BorderSide(
                                  color: Colors.white.withOpacity(0.3),
                                  width: 1,
                                ),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                Flexible(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        "${place["title"]}",
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 15.0,
                                          color: Colors.black87,
                                        ),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      SizedBox(height: 2.0),
                                      Row(
                                        children: [
                                          Icon(
                                            Icons.location_on,
                                            size: 13.0,
                                            color: Colors.blue[700],
                                          ),
                                          SizedBox(width: 3.0),
                                          Expanded(
                                            child: Text(
                                              _getLocation(),
                                              style: TextStyle(
                                                fontSize: 12.0,
                                                color: Colors.grey[600],
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
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      _getFormattedPrice(),
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 12.0,
                                        color: Colors.blue[700],
                                      ),
                                    ),
                                    // if (place['is_eco_friendly'] == true)
                                    // Container(
                                    //   padding: EdgeInsets.symmetric(
                                    //     horizontal: 8,
                                    //     vertical: 4,
                                    //   ),
                                    //   decoration: BoxDecoration(
                                    //     color: Colors.green.withOpacity(0.2),
                                    //     borderRadius: BorderRadius.circular(
                                    //       12,
                                    //     ),
                                    //     border: Border.all(
                                    //       color: Colors.green.withOpacity(
                                    //         0.5,
                                    //       ),
                                    //       width: 1,
                                    //     ),
                                    //   ),
                                    //   child: Row(
                                    //     mainAxisSize: MainAxisSize.min,
                                    //     children: [
                                    //       Icon(
                                    //         Icons.eco,
                                    //         size: 10,
                                    //         color: Colors.green,
                                    //       ),
                                    //       SizedBox(width: 4),
                                    //       Text(
                                    //         'Eco',
                                    //         style: TextStyle(
                                    //           color: Colors.green[700],
                                    //           fontSize: 7,
                                    //           fontWeight: FontWeight.bold,
                                    //         ),
                                    //       ),
                                    //     ],
                                    //   ),
                                    // ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
