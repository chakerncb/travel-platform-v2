import 'package:flutter/material.dart';

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
    return 'DZD ${price.toStringAsFixed(0)}/${days}d';
  }

  @override
  Widget build(BuildContext context) {
    final imageUrl = _getImageUrl();

    return Padding(
      padding: const EdgeInsets.only(bottom: 15.0),
      child: InkWell(
        child: Container(
          height: 70.0,
          child: Row(
            children: <Widget>[
              ClipRRect(
                borderRadius: BorderRadius.circular(5),
                child: imageUrl.isNotEmpty
                    ? Image.network(
                        imageUrl.replaceAll('localhost', '10.0.2.2'),
                        height: 70.0,
                        width: 70.0,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            height: 70.0,
                            width: 70.0,
                            color: Colors.grey[300],
                            child: Icon(Icons.image_not_supported),
                          );
                        },
                        loadingBuilder: (context, child, loadingProgress) {
                          if (loadingProgress == null) return child;
                          return Container(
                            height: 70.0,
                            width: 70.0,
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
                        height: 70.0,
                        width: 70.0,
                        color: Colors.grey[300],
                        child: Icon(Icons.landscape),
                      ),
              ),
              SizedBox(width: 15.0),
              Expanded(
                child: Container(
                  height: 80.0,
                  child: ListView(
                    primary: false,
                    physics: NeverScrollableScrollPhysics(),
                    shrinkWrap: true,
                    children: <Widget>[
                      Container(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          "${place["title"]}",
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            fontSize: 14.0,
                          ),
                          maxLines: 2,
                          textAlign: TextAlign.left,
                        ),
                      ),
                      SizedBox(height: 3.0),
                      Row(
                        children: <Widget>[
                          Icon(
                            Icons.location_on,
                            size: 13.0,
                            color: Colors.blueGrey[300],
                          ),
                          SizedBox(width: 3.0),
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
                      SizedBox(height: 10.0),
                      Container(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          _getFormattedPrice(),
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16.0,
                          ),
                          maxLines: 1,
                          textAlign: TextAlign.left,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
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
