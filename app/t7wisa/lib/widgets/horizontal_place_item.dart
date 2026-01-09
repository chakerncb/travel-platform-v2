import 'package:flutter/material.dart';

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
      padding: const EdgeInsets.only(right: 20.0),
      child: InkWell(
        child: SizedBox(
          width: 140.0,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: imageUrl.isNotEmpty
                      ? Image.network(
                          imageUrl.replaceAll('localhost', '10.0.2.2'),
                          height: 178.0,
                          width: 140.0,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              height: 178.0,
                              width: 140.0,
                              color: Colors.grey[300],
                              child: Icon(Icons.image_not_supported, size: 50),
                            );
                          },
                          loadingBuilder: (context, child, loadingProgress) {
                            if (loadingProgress == null) return child;
                            return Container(
                              height: 178.0,
                              width: 140.0,
                              color: Colors.grey[200],
                              child: Center(
                                child: CircularProgressIndicator(
                                  value:
                                      loadingProgress.expectedTotalBytes != null
                                      ? loadingProgress.cumulativeBytesLoaded /
                                            loadingProgress.expectedTotalBytes!
                                      : null,
                                ),
                              ),
                            );
                          },
                        )
                      : Container(
                          height: 178.0,
                          width: 140.0,
                          color: Colors.grey[300],
                          child: Icon(Icons.landscape, size: 50),
                        ),
                ),
                SizedBox(height: 7.0),
                Container(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    "${place['title'] ?? 'Unknown Tour'}",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15.0,
                    ),
                    maxLines: 2,
                    textAlign: TextAlign.left,
                  ),
                ),
                SizedBox(height: 3.0),
                Container(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    _getLocation(),
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 13.0,
                      color: Colors.blueGrey[300],
                    ),
                    maxLines: 1,
                    textAlign: TextAlign.left,
                  ),
                ),
              ],
            ),
          ),
        ),
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
      ),
    );
  }
}
