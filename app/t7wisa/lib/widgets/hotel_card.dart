import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/hotel.dart';

class HotelCard extends StatelessWidget {
  final Hotel hotel;
  final bool isSelected;
  final VoidCallback? onTap;
  final VoidCallback? onRemove;

  const HotelCard({
    Key? key,
    required this.hotel,
    this.isSelected = false,
    this.onTap,
    this.onRemove,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: isSelected ? 4 : 2,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: isSelected
            ? const BorderSide(color: Colors.blue, width: 2)
            : BorderSide.none,
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
              child: hotel.imageUrl != null
                  ? CachedNetworkImage(
                      imageUrl: hotel.imageUrl!,
                      width: double.infinity,
                      height: 180,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(
                        height: 180,
                        color: Colors.grey[300],
                        child: const Center(child: CircularProgressIndicator()),
                      ),
                      errorWidget: (context, url, error) => Container(
                        height: 180,
                        color: Colors.grey[300],
                        child: const Icon(Icons.hotel, size: 50),
                      ),
                    )
                  : Container(
                      height: 180,
                      color: Colors.grey[300],
                      child: const Icon(Icons.hotel, size: 50),
                    ),
            ),
            // Content
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          hotel.name,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (hotel.starRating != null) ...[
                        const SizedBox(width: 8),
                        Row(
                          children: List.generate(
                            hotel.starRating!,
                            (index) => const Icon(
                              Icons.star,
                              size: 16,
                              color: Colors.amber,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on,
                        size: 16,
                        color: Colors.grey,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          '${hotel.city ?? ''}, ${hotel.country ?? ''}',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  if (hotel.address != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      hotel.address!,
                      style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      if (hotel.rating != null)
                        Row(
                          children: [
                            const Icon(
                              Icons.thumb_up,
                              size: 16,
                              color: Colors.green,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${hotel.rating!.toStringAsFixed(1)}/5',
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            if (hotel.totalReviews != null)
                              Text(
                                ' (${hotel.totalReviews})',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                              ),
                          ],
                        ),
                      if (hotel.pricePerNight != null)
                        Text(
                          '${hotel.currency ?? 'DA'} ${hotel.pricePerNight!.toStringAsFixed(0)}/night',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                          ),
                        ),
                    ],
                  ),
                  if (onRemove != null) ...[
                    const SizedBox(height: 8),
                    TextButton.icon(
                      onPressed: onRemove,
                      icon: const Icon(Icons.close, size: 16),
                      label: const Text('Remove'),
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.red,
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
